/**
 * Created by anil on 5/7/15.
 */

module.exports = {

    /**
     * Adds days to date
     * @param date
     * @param days
     */
    addDays : function(date , days){
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    /**
     * Get date in YYYYMMDD Format
     * @param date
     * @returns {string}
     */
    getYYYYMMDDFormat : function(date){
        return date.toISOString().slice(0,10).replace(/-/g,"");
    },

    /**
     *
     * @param d : date
     * @param timeString : 12.00 am
     * @returns {Date|*}
     */
    setTime : function(d , timeString){
        var test, parts, hours, minutes, date,
            timeReg = /(\d+)\.(\d+) (\w+)/;
        parts = timeString.match(timeReg);

        hours = /am/i.test(parts[3]) ?
            function(am) {return am < 12 ? am : 0}(parseInt(parts[1], 10)) :
            function(pm) {return pm < 12 ? pm + 12 : 12}(parseInt(parts[1], 10));

        minutes = parseInt(parts[2], 10);

        date = new Date(d);

        date.setHours(hours);
        date.setMinutes(minutes);

       return date;
    }
}