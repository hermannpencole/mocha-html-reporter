var astronaut = require('../../var/epoch-user.json'),
    prompt = require('prompt'),
    writeson = require('writeson'),
    path = __dirname;

//Main Astronaut function
function init() {
    var myUser = {};
    var schema = {
            properties: {
                // Get users name
                name: {
                    type: 'string',
                    pattern: /^[a-zA-Z\s\-]+$/,
                    message: 'Name must be only letters, spaces, or dashes',
                    required: true
                },
                // Get users email
                email: {
                    type: 'string',
                    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
                    message: 'Email must be only letters, spaces, or dashes and include "@" and ".xyz"',
                    required: true
                }
            }
        };
    // Start the prompt
    prompt.start();
    // Get two properties from the user: username and email
    prompt.get(schema, function (err, result) {
        if (err) throw err;
        var myUserFile = 'reports/data/user.json';

        myUser.name = result.name;
        myUser.email = result.email;
        myUser.path = astronaut.scenario.user.path;
        myUser.host = astronaut.scenario.user.host;

        // Write generated user info to epoch-user.json
        writeson(myUserFile, myUser, function (err) {
            if (err) return console.error(err);
        });

        // Log the results.
        console.log('Astronaut:');
        console.log('> name: ' + result.name);
        console.log('> email: ' + result.email);
        console.log('> path: ' + path);
        console.log(myUser);
    });
}

//To test with node, uncomment init()
//init();

module.exports = {
    init: init
};