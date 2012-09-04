(function (jasmine, console){

    if (!jasmine) throw new Error('jasmine not found!');
    if (!console) throw new Error('firebug not found!');

    /**
     * I think a simple plain object would do the trick
     * but let's not change for the sake of change.
     */
    jasmine.FirebugReporter = function (){};
    
    jasmine.FirebugReporter.prototype = {

        /**
         * ???
         */
        log: function (){
            throw new Error('implement log', arguments);
        },
        
        /**
         * When tests are going to execute
         */
        reportRunnerStarting: function (runner){
        },
        
        /**
         * When tests have finished
         */
        reportRunnerResults: function (runner){
        },
        
        /**
         * When a 'describe' function executes
         */
        reportSuiteStarting: function (suite){
            console.group(suite.description);
        },
        
        /**
         * When a 'describe' function finishes
         */
        reportSuiteResults: function (suite){
            console.groupEnd();
        },
        
        /**
         * When a 'it' function executes
         */
        reportSpecStarting: function (spec){
        },
        
        /**
         * When a 'it' function finishes
         */
        reportSpecResults: function (spec){
            if (spec.results_.passed()){
                console.groupCollapsed('%c'+spec.description, 'color:green');
            } else {
                console.group('%c'+spec.description, 'color:red');
            }
            //Loop through all the expectations?
            spec.results().getItems().forEach(function (item){
                console.log('%c'+/*cast to string*/String(item),
                            item.passed()?'color:green':'color:red');
            });
            console.groupEnd();
        }
    };

})(window.jasmine, window.console);
