import { differenceInDays } from 'date-fns';
import { uuid } from 'uuidv4';

/**
 * Converts a date string in the form of 'dd/mm/yy' to a JavaScript Date object.
 * @param dateString - date string in the form 'dd/mm/yyyy'
 * @returns - a JavaScript Date object for the passed string
 */
const convertToDate = (dateString: string): Date => {
    const [_, day, month, year] = dateString.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    return new Date(+year, +month - 1, +day);
}

/**
 * Checks whether a Javascript Date object is non-null or not.
 * @param d - JavaScript Date object to be checked
 * @returns - a boolean value that indicates whether the passed date is non-null or not
 */
const isValidDate = (d: Date): boolean => {
    return !isNaN(d as any);
}

export {
    differenceInDays,
    uuid,
    isValidDate,
    convertToDate
}