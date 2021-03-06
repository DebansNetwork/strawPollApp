/*
 * GET home page.
 */

// in memory store
// TODO: replace in memory data store with persistent storage
var pollData = {
    north: {
        participation: {
            yes: 0,
            no: 0
        },
        candidates: [
            {
                party: 'puppies',
                name: 'Alpha Puppy',
                votes: 0
            },
            {
                party: 'kittens',
                name: 'Bravo Kitten',
                votes: 0
            },
            {
                party: 'bunnies',
                name: 'Charlie Bunny',
                votes: 0
            }
        ]
    },
    south: {
        participation: {
            yes: 0,
            no: 0
        },
        candidates: [
            {
                party: 'puppies',
                name: 'Delta Puppy',
                votes: 0
            },
            {
                party: 'kittens',
                name: 'Echo Kitten',
                votes: 0
            },
            {
                party: 'bunnies',
                name: 'Foxtrot Bunny',
                votes: 0
            },
            {
                party: 'independent',
                name: 'Golf Independent',
                votes: 0
            },
            {
                party: 'independent',
                name: 'Hotel Independent',
                votes: 0
            },
            {
                party: 'independent',
                name: 'Juliet Independent',
                votes: 0
            }
        ]
    }
};

// TODO: Generate parties variable programmatically
var nationalPoll = {
    'puppies': 0,
    'kittens': 0,
    'bunnies': 0,
    'independent': 0
};

// TODO: Generate constituencies programmatically
var constituencies = [
    'north',
    'south'
];

exports.index = function (req, res) {
    res.render('index', {
        title: 'MySociety Straw Poll',
        constituencies: constituencies
    });
};

exports.vote = function (req, res) {
    var voting = req.body.voting,
        constituency = req.body.constituency;

    var candidates = pollData[constituency]['candidates'];

    console.log('User is voting? ' + voting);
    console.log('User is in constituency ' + constituency);

    // tally isVoting? response in data store
    pollData[constituency]['participation'][voting] += 1;
    console.log(JSON.stringify(pollData));

    // fork - are they voting or not?
    // YES -> poll form
    // NO -> results page
    if (voting === 'yes') {

        // setup candidates array for voting form

        console.log(candidates.length + ' candidates in constituency ' + constituency);

        res.render('poll', {
            title: 'MySociety Straw Poll - informal poll',
            candidates: candidates,
            constituency: constituency
        });

    } else {
        res.render('results', {
            title: 'MySociety Straw Poll - poll results',
            constituency: constituency,
            candidates: candidates,
            nationalPoll: nationalPoll,
            regionalChartData: processRegionalData(candidates),
            nationalChartData: processNationalData(nationalPoll)
        });
    }
};

exports.results = function (req, res) {
    var constituency = req.body.constituency,
        vote = req.body.vote;

    console.log('User in constituency ' + constituency + ' is voting for ' + vote + '.');

    // tally vote in data store
    var candidates = pollData[constituency]['candidates'];

    for (var i = 0; i < candidates.length; i += 1) {
        if (candidates[i].name === vote) {
            var party = candidates[i].party;

            pollData[constituency]['candidates'][i].votes += 1;
            nationalPoll[party] += 1;
            break;
        }
    }

    console.log(JSON.stringify(pollData));
    console.log(JSON.stringify(nationalPoll));

    res.render('results', {
        title: 'MySociety Straw Poll - poll results',
        constituency: constituency,
        candidates: candidates,
        nationalPoll: nationalPoll,
        regionalChartData: processRegionalData(candidates),
        nationalChartData: processNationalData(nationalPoll)
    });
};

var partyColours = {
    puppies: "#ff4444",
    kittens: "#33b5e5",
    bunnies: "#ffbb33",
    independent: "#99cc00"
};

var processRegionalData = function (regionalPollData) {
    console.log("processRegionalData: " + JSON.stringify(regionalPollData));

    var chartData = [];
    for (var i = 0; i < regionalPollData.length; i += 1) {
       var temp = {};
        if (regionalPollData[i].votes !== 0) {
            temp.value = regionalPollData[i].votes;
            temp.color = partyColours[regionalPollData[i].party];
            chartData.push(temp);
        }
    }

    console.log(JSON.stringify(chartData));

    return chartData;
};

var processNationalData = function (nationalPollData) {
    console.log("processNationalData: " + JSON.stringify(nationalPollData));

    var chartData = [];
    for (key in nationalPollData) {
        var temp = {};
        if (nationalPollData[key] !== 0) {
            temp.value = nationalPollData[key];
            temp.color = partyColours[key];
            chartData.push(temp);
        }
    }

    console.log(JSON.stringify(chartData));

    return chartData;
};

