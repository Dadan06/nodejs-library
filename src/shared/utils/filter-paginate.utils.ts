// tslint:disable:no-any import-blacklist
import { get } from 'lodash';
import { Document, Model } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { FilterItem } from '../types/filter-item.interface';

export interface FilterUpdateConfig {
    filter: string;
    repository: BaseRepository<any, any>;
    criteria: any;
    field: string;
}

export const buildSearchCriteria = <T>(
    search: string | null,
    searchFields: Array<string>
): Object =>
    search
        ? {
              $or: searchFields.map(field => ({
                  [field]: { $regex: search, $options: 'i' }
              }))
          }
        : {};

export const buildFilterCriteria = <T>(
    criteria: Record<string, any>,
    fieldMap: Record<string, string>
): Object =>
    criteria
        ? Object.assign(
              {},
              ...Object.entries(criteria)
                  .filter(([key, value]) => value && value.length && fieldMap[key])
                  .map(([key, value]) => ({
                      [fieldMap[key]]: { $in: Array.isArray(value) ? value : [value] }
                  }))
          )
        : {};

export const initFilterUpdates = async <T extends Document, U>(
    fieldMap: Record<string, string>,
    repository: BaseRepository<T, U>
): Promise<Record<string, FilterItem[]>> => {
    const filterUpdates: Record<string, any> = {};
    for (const key in fieldMap) {
        if (fieldMap.hasOwnProperty(key)) {
            const items = await repository
                .find({})
                .distinct(fieldMap[key])
                .exec();
            filterUpdates[key] = items.map((name: string): FilterItem => ({ name, count: 0 }));
        }
    }
    return filterUpdates as Record<string, FilterItem[]>;
};

export const setFilterUpdatesCounts = <T extends Record<string, any>>(
    filterUpdates: Record<string, FilterItem[]>,
    entities: T[],
    fieldMap: Record<string, string>,
    initialCount: Record<string, Record<string, number>>
) => {
    const counts: Record<string, Record<string, number>> = initialCount;

    entities.forEach((e: T) => {
        Object.entries(fieldMap).forEach(([key, value]) => {
            const val = get(e, value);
            const values: any[] = Array.isArray(val) ? val : [val];
            values.forEach(v => {
                counts[key][v] = (counts[key][v] || 0) + 1;
            });
        });
    });

    Object.entries(filterUpdates).forEach(([key, filterItems]) => {
        filterItems.forEach(
            (filterItem: FilterItem) => (filterItem.count = counts[key][filterItem.name])
        );
    });
};

export interface FilteredItems<T> {
    items: T[];
    filter: Record<string, Record<string, number>>;
}

export const buildPeriodCriteria = (fieldName: string, from: Date, to: Date) => ({
    [fieldName]: {
        $gte: new Date(from),
        $lte: new Date(to)
    }
});

export const initFilterUpdatesUsingMultipleRepository = async <T extends Document, U>(
    filterUpdateConfigs: FilterUpdateConfig[]
): Promise<Record<string, FilterItem[]>> => {
    const filterUpdates: Record<string, any> = {};
    for (const { filter, repository, criteria, field } of filterUpdateConfigs) {
        const items = await repository
            .find(criteria)
            .distinct(field)
            .exec();
        filterUpdates[filter] = items
            .filter(name => name)
            .map((name: string): FilterItem => ({ name, count: 0 }));
    }
    return filterUpdates as Record<string, FilterItem[]>;
};

export const getFilteredWithEmbeddedFields = <T extends Document>(
    criteria: Record<string, any>,
    fieldMap: Record<string, string>,
    searchFields: Array<string>,
    sort: any,
    model: Model<T>,
    populationStages: object[],
    additionnalCriteria?: Record<string, any>
    // tslint:disable-next-line: parameters-max-number
) => {
    const searchCriteria = buildSearchCriteria(criteria.search, searchFields);
    const filterCriteria = buildFilterCriteria(criteria, fieldMap);
    return model
        .aggregate([
            ...populationStages,
            {
                $match: {
                    ...searchCriteria,
                    ...filterCriteria,
                    ...additionnalCriteria
                }
            },
            {
                $sort: {
                    [sort.by]: sort.direction === 'asc' ? 1 : -1
                }
            }
        ])
        .exec();
};

export const checkDuplicate = async <T extends Document, U>(
    repository: BaseRepository<T, U>,
    key: string,
    subject: any
): Promise<boolean> => {
    let criteria: object = { [key]: subject[key] };
    if (subject._id) {
        criteria = { ...criteria, _id: { $ne: subject._id } };
    }
    const existing: T | null = await repository.findOne(criteria).exec();
    return !!existing;
};
