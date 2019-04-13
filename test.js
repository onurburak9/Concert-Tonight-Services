let events = require('./events');






events.listConcerts(
    {
        body: {
            location: "San Francisco"

        },

    }, //event
    {}, //content
    function (ss, data) {
        //callback function with two arguments
        console.log("---------------SUCCESS EXAMPLE------------------");
        console.log(data);
    }
);