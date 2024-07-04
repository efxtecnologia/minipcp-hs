function tap(x) {
    console.log(x);
    return x;
}

function debug(x, config) {
    if ( config.debug ) {
        return tap(x);
    }
    return x;
}

function trimLeft(s, chars) {
    function doTrim(a) {
        if ( a.length > 0 && chars.includes(a[0]) ) {
            return doTrim(a.slice(1));
        }
        return a;
    }
    return doTrim(s.split('')).join("");
}

function assocIf(o, attr, value) {
    if ( value === null || value === undefined ) {
        return o;
    }
    return Object.assign({}, o, { [attr]: value });
}

function uselessPipeReducerResult(x) {
    return x === null  || x === undefined;
}

function uselessNumPipeReducerResult(x) {
    return isNaN(x) || uselessPipeReducerResult(x);
}

function somePipeReducer(result, fn) {
    if (uselessPipeReducerResult(result)) {
        return null;
    }
    return fn(result);
}

function someNumPipeReducer(result, fn) {
    if (uselessNumPipeReducerResult(result)) {
        return null;
    }
    return fn(result);
}

function somePipeRunner(args, reducerFn) {
    const initialValue = args[0],
          functions = args.slice(1);

    return functions.reduce(reducerFn, initialValue);
}

function somePipe() {
    return somePipeRunner(Array.prototype.slice.call(arguments), somePipeReducer);
}

function someNumPipe() {
    return somePipeRunner(Array.prototype.slice.call(arguments), someNumPipeReducer);
}

function dayOfYear(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay) + 1;
}

function weekNumber(date) {
    const d = new Date(date.getTime());
    const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
    d.setDate(d.getDate() - d.getDay());
    const oneDay = (1000 * 60 * 60 * 24);
    const diff = d - firstDayOfYear;
    return Math.ceil((diff / oneDay) / 7) + 1;
}

function dateFromWeekNumber(year, weekNumber) {
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    const daysToSelectedWeek = (weekNumber - 1) * 7;
    return new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysToSelectedWeek - dayOfWeek));
}

const identity = x => x,
      constantly = x => () => x,
      maybeWithDelim = (value, cond, delim) => value + (cond ? delim : ''),
      maybeWithSpace = value => maybeWithDelim(value, value !== "", ''),
      arrayIntersection = (a1, a2) => a1.filter(x => a2.includes(x)),
      doubleQuoted = s => `"${s}"`,
      singleQuotedStr = s => `'${s.replaceAll("'", "''")}'`;

module.exports = {
    tap,
    debug,
    identity,
    constantly,
    trimLeft,
    maybeWithDelim,
    maybeWithSpace,
    assocIf,
    somePipe,
    someNumPipe,
    arrayIntersection,
    doubleQuoted,
    singleQuotedStr,
    dayOfYear,
    weekNumber,
    dateFromWeekNumber,
};
