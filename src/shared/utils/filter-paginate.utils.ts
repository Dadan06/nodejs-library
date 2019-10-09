// tslint:disable-next-line: import-blacklist
import { get } from 'lodash';
import { Document, DocumentQuery, Model } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { FilterItem } from '../types/filter-item.interface';

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
    // tslint:disable-next-line:no-any
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
    // tslint:disable-next-line:no-any
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

// tslint:disable-next-line:no-any
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
            // tslint:disable-next-line:no-any
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

export const buildMergedCriteria = <T extends Document>(
    // tslint:disable-next-line:no-any
    criteria: Record<string, any>,
    fieldMap: Record<string, string>,
    searchFields: Array<string>,
    // tslint:disable-next-line:no-any
    additionnalCriteria?: Record<string, any>
): Object => {
    const filterCriteria = buildFilterCriteria<T>(criteria, fieldMap);
    const searchCriteria = buildSearchCriteria<T>(criteria.search, searchFields);
    return additionnalCriteria
        ? { ...filterCriteria, ...searchCriteria, ...additionnalCriteria }
        : { ...filterCriteria, ...searchCriteria };
};
export interface FilteredItems<T> {
    items: T[];
    filter: Record<string, Record<string, number>>;
}

export const getFilteredItems = <T extends Document>(param: {
    schema: Model<T>;
    populateStages: Object[];
    // tslint:disable-next-line:no-any
    criteria: Record<string, any>;
    fieldMap: Record<string, string>;
    searchFields: Array<string>;
}) => {
    const stages = Object.entries(param.fieldMap).map(field => ({
        [field[0]]: [
            {
                $group: {
                    _id: `$${field[1]}`,
                    count: {
                        $sum: 1
                    }
                }
            }
        ]
    }));
    return param.schema.aggregate([
        ...param.populateStages,
        {
            $facet: {
                ...stages.reduce((result, item) => {
                    const key = Object.keys(item)[0];
                    result[key] = item[key];
                    return result;
                }, {}),
                items: [
                    {
                        $match: buildMergedCriteria(
                            param.criteria,
                            param.fieldMap,
                            param.searchFields
                        )
                    }
                ]
            }
        }
    ]);
};

// tslint:disable-next-line:no-any
export const getFiltered = <T extends Document, U>(
    // tslint:disable-next-line:no-any
    criteria: Record<string, any>,
    fieldMap: Record<string, string>,
    searchFields: Array<string>,
    repository: BaseRepository<T, U>
): Promise<T[]> =>
    repository
        .find(buildMergedCriteria(criteria, fieldMap, searchFields))
        .sort({})
        .exec();

export const getFilteredWithAdditionnalCriteria = <T extends Document, U>(param: {
    // tslint:disable-next-line:no-any
    criteria: Record<string, any>;
    fieldMap: Record<string, string>;
    searchFields: Array<string>;
    repository: BaseRepository<T, U>;
    // tslint:disable-next-line:no-any
    additionnalCriteria: Record<string, any>;
}): Promise<T[]> =>
    param.repository
        .find(
            buildMergedCriteria(
                param.criteria,
                param.fieldMap,
                param.searchFields,
                param.additionnalCriteria
            )
        )
        .sort({})
        .exec();

export const checkDuplicate = async <T extends Document, U>(
    repository: BaseRepository<T, U>,
    key: string,
    // tslint:disable-next-line: no-any
    subject: any
): Promise<boolean> => {
    let criteria: object = { [key]: subject[key] };
    if (subject._id) {
        criteria = { ...criteria, _id: { $ne: subject._id } };
    }
    const existing: T | null = await repository.findOne(criteria).exec();
    return !!existing;
};

export const getFilteredDocument = <T extends Document, U>(
    // tslint:disable-next-line:no-any
    criteria: Record<string, any>,
    fieldMap: Record<string, string>,
    searchFields: Array<string>,
    repository: BaseRepository<T, U>
): DocumentQuery<T[], T> => repository.find(buildMergedCriteria(criteria, fieldMap, searchFields));

export const buildPeriodCriteria = (fieldName: string, from: Date, to: Date) => ({
    [fieldName]: {
        $gte: new Date(from),
        $lte: new Date(to)
    }
});

export const buildCriteriasWithPeriod = <T extends Document>(
    // tslint:disable-next-line:no-any
    criteria: Record<string, any>,
    fieldMap: Record<string, string>,
    searchFields: Array<string>,
    periodFilterFieldName: string
): Object => {
    const { from, to } = criteria.from && criteria.to ? criteria : { from: null, to: null };
    return {
        ...buildFilterCriteria<T>(criteria, fieldMap),
        ...buildSearchCriteria<T>(criteria.search, searchFields),
        ...(criteria.from && criteria.to
            ? buildPeriodCriteria(periodFilterFieldName, from, to)
            : {})
    };
};

export const getFilteredWithPeriod = <T extends Document, U>(input: {
    // tslint:disable-next-line:no-any
    criteria: Record<string, any>;
    fieldMap: Record<string, string>;
    searchFields: Array<string>;
    repository: BaseRepository<T, U>;
    periodFilterFieldName: string;
}): Promise<T[]> =>
    input.repository
        .find(
            buildCriteriasWithPeriod(
                input.criteria,
                input.fieldMap,
                input.searchFields,
                input.periodFilterFieldName
            )
        )
        .sort({})
        .exec();
