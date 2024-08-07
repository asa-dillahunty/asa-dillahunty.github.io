// let variance = 0;

// const totalRounds = 1000;
// let rounds = totalRounds;
// while (rounds > 0) {
//     const basePoints = [100, 80, 60, 50, 45, 40, 35, 30, 25, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 1];

//     // console.log("here");

//     let draftIndex, currPlayer = 0;
//     const players = [0, 0, 0, 0];
//     while (basePoints.length > 0) {
//         draftIndex = Math.floor(Math.random()*basePoints.length);
//         players[currPlayer] += basePoints[draftIndex];

//         basePoints.splice(draftIndex, 1);


//         // inc player
//         currPlayer = (currPlayer + 1)%4;
//     }

//     variance += (Math.max(...players) - Math.min(...players))/Math.max(...players);
//     rounds--;
// }

// console.log(variance/totalRounds);
//                  1     2    3   4   5   6   7    8  9   10  11  12  13  14 15 16 17 18 19 20
// const basePoints = [150, 125, 100, 60, 50, 40, 35, 30, 15, 12, 10, 10, 10, 5, 5, 5, 5, 3, 1, -25];
// const competitors = Array.from({ length: 40 }, (_, i) => ({
//     name: `Competitor ${i + 1}`,
//     rank: i + 1
// }));

// const players = [
//     { name: 'Player 1', picks: [] },
//     { name: 'Player 2', picks: [] },
//     { name: 'Player 3', picks: [] },
//     { name: 'Player 4', picks: [] }
// ];

// function snakeDraft(players, competitors) {
//     let draftOrder = [...players];
//     let pickIndex = 0;

//     while (competitors.length > 0) {
//         for (let i = 0; i < draftOrder.length; i++) {
//             if (competitors.length === 0) break;

//             // Player picks the best available competitor
//             const bestCompetitor = competitors.shift();
//             draftOrder[i].picks.push(bestCompetitor);

//             pickIndex++;
//         }

//         // Reverse draft order for the next round
//         draftOrder.reverse();
//     }

//     return players;
// }

// const draftedPlayers = snakeDraft(players, competitors);

// draftedPlayers.forEach(player => {
//     let score = 0;
//     console.log(`${player.name} picks:`);
//     player.picks.forEach(pick => {
//         // console.log(`- ${pick.name} (Rank ${pick.rank})`);
//         score += basePoints[Math.floor((pick.rank-1)/2)];
//     });
//     console.log('score: ', score);

// });

const teamComposition = [
    {
        "team_name": "Bell",
        "competitors": [
            "Duffy Colin",
            "Harrison Campbell",
            "Gines Lopez Alberto",
            "Jenft Paul",
            "Garnbret Janja",
            "Pilz Jessica",
            "Mackenzie Oceania",
            "Mukheibir Lauren",
            "Nonaka Miho",
            "Avezou Zelia"
        ]
    },
    {
        "team_name": "Dill",
        "competitors": [
            "LEE Dohyun",
            "Schubert Jakob",
            "Flohe Yannick",
            "Lehmann Sascha",
            "Potocar Luka",
            "Mori Ai",
            "Zhang Yuetong",
            "Raboutou Brooke",
            "Seo Chaehyun",
            "Thompson-Smith Molly"
        ]
    },
    {
        "team_name": "Mitt",
        "competitors": [
            "Anraku Sorato",
            "Avezou Sam",
            "Roberts Toby",
            "Janse van Rensburg Mel",
            "Ondra Adam",
            "van Duysen Hannes",
            "PAN Yufei",
            "Bertone Oriane",
            "LUO Zhilu",
            "DOERFFEL Lucia"
        ]
    },
    {
        "team_name": "Ray",
        "competitors": [
            "Narasaki Tomoa",
            "Grupper Jesse",
            "McArthur Hamish",
            "Megos Alexander",
            "Grossman Natalia",
            "McNeice Erin",
            "Kazbekova Ievgeniia",
            "Krampl Mia",
            "Moroni Camilla",
            "Rogora Laura"
        ]
    }
]

const scoringArray = [150, 125, 100, 60, 50, 40, 35, 30, 15, 12, 10, 10, 10, 5, 5, 5, 5, 3, 1, -25];
const categoryNames = {
    WOMENS_SEMIS:'WS',
    WOMENS_FINALS:'WF',
    MENS_SEMIS:'MS',
    MENS_FINALS:'MF'
}

const allRounds = [];
const mensBoulderSemis = {
    category: categoryNames.MENS_SEMIS,
    name:"Mens Bouldering Semis",
    results: [
        {"athlete_name": "ANRAKU Sorato", "total_score": 69.0},
        {"athlete_name": "NARASAKI Tomoa", "total_score": 54.4},
        {"athlete_name": "ROBERTS Toby", "total_score": 54.1},
        {"athlete_name": "AVEZOU Sam", "total_score": 49.2},
        {"athlete_name": "ONDRA Adam", "total_score": 48.7},
        {"athlete_name": "SCHUBERT Jakob", "total_score": 44.7},
        {"athlete_name": "Van DUYSEN Hannes", "total_score": 34.3},
        {"athlete_name": "McARTHUR Hamish", "total_score": 34.2},
        {"athlete_name": "JENFT Paul", "total_score": 34.1},
        {"athlete_name": "LEE Dohyun", "total_score": 34.0},
        {"athlete_name": "DUFFY Colin", "total_score": 33.8},
        {"athlete_name": "FLOHE Yannick", "total_score": 29.7},
        {"athlete_name": "PAN Yufei", "total_score": 29.0},
        {"athlete_name": "GINES LOPEZ Alberto", "total_score": 28.7},
        {"athlete_name": "MEGOS Alexander", "total_score": 24.7},
        {"athlete_name": "LEHMANN Sascha", "total_score": 24.0},
        {"athlete_name": "POTOCAR Luka", "total_score": 19.6},
        {"athlete_name": "GRUPPER Jesse", "total_score": 18.9},
        {"athlete_name": "HARRISON Campbell", "total_score": 9.4},
        {"athlete_name": "JANSE van RENSBURG Mel", "total_score": 9.4}
    ]
};

const womensBoulderSemis = {
    name: "Womens Bouldering semi-finals",
    category: categoryNames.WOMENS_SEMIS,
    results: [
        {"athlete_name": "GARNBRET Janja", "total_score": 99.6},
        {"athlete_name": "BERTONE Oriane", "total_score": 84.5},
        {"athlete_name": "RABOUTOU Brooke", "total_score": 83.7},
        {"athlete_name": "MACKENZIE Oceania", "total_score": 79.6},
        {"athlete_name": "GROSSMAN Natalia", "total_score": 69.2},
        {"athlete_name": "PILZ Jessica", "total_score": 68.8},
        {"athlete_name": "NONAKA Miho", "total_score": 64.4},
        {"athlete_name": "MORONI Camilla", "total_score": 64.0},
        {"athlete_name": "LUO Zhilu", "total_score": 63.6},
        {"athlete_name": "McNEICE Erin", "total_score": 59.6},
        {"athlete_name": "MORI Ai", "total_score": 54.0},
        {"athlete_name": "AVEZOU Zelia", "total_score": 49.3},
        {"athlete_name": "SEO Chaehyun", "total_score": 44.2},
        {"athlete_name": "KAZBEKOVA Ievgeniia", "total_score": 39.5},
        {"athlete_name": "ZHANG Yuetong", "total_score": 29.7},
        {"athlete_name": "DOERFFEL Lucia", "total_score": 29.2},
        {"athlete_name": "KRAMPL Mia", "total_score": 28.4},
        {"athlete_name": "ROGORA Laura", "total_score": 13.2},
        {"athlete_name": "THOMPSON-SMITH Molly", "total_score": 9.8},
        {"athlete_name": "MUKHEIBIR Lauren", "total_score": 0.0}
    ]
}

const mensLeadSemis = {
    category: categoryNames.MENS_SEMIS,
    name:"Mens Lead Semis",
    results: [
        {"athlete_name": "ANRAKU Sorato", "total_score": 68},
        {"athlete_name": "ROBERTS Toby", "total_score": 68.1},
        {"athlete_name": "ONDRA Adam", "total_score": 68.1},
        {"athlete_name": "GINES LOPEZ Alberto", "total_score": 72},
        {"athlete_name": "SCHUBERT Jakob", "total_score": 54.1},
        {"athlete_name": "JENFT Paul", "total_score": 57},
        {"athlete_name": "DUFFY Colin", "total_score": 54.1},
        {"athlete_name": "McARTHUR Hamish", "total_score": 45.1},
        {"athlete_name": "FLOHE Yannick", "total_score": 39.1},
        {"athlete_name": "NARASAKI Tomoa", "total_score": 12.1},
        {"athlete_name": "AVEZOU Sam", "total_score": 12.1},
        {"athlete_name": "PAN Yufei", "total_score": 30.1},
        {"athlete_name": "MEGOS Alexander", "total_score": 24},
        {"athlete_name": "Van DUYSEN Hannes", "total_score": 12},
        {"athlete_name": "LEE Dohyun", "total_score": 12},
        {"athlete_name": "POTOCAR Luka", "total_score": 24},
        {"athlete_name": "LEHMANN Sascha", "total_score": 12.1},
        {"athlete_name": "GRUPPER Jesse", "total_score": 12},
        {"athlete_name": "HARRISON Campbell", "total_score": 14},
        {"athlete_name": "JANSE van RENSBURG Mel", "total_score": 7.1}
    ]
};

allRounds.push(mensBoulderSemis);
allRounds.push(womensBoulderSemis);
allRounds.push(mensLeadSemis);

function mergeRankings(rounds, semisCategory, finalsCategory) {
    const semisRankings = getCategoryRankings(rounds, semisCategory);
    const finalsRankings = getCategoryRankings(rounds, finalsCategory);

    // Create a set of athletes who made it to the finals
    const finalsAthletesSet = new Set(finalsRankings.map(athlete => athlete.athlete_name));

    // Filter out the athletes who made it to the finals from the semis rankings
    const filteredSemisRankings = semisRankings.filter(athlete => !finalsAthletesSet.has(athlete.athlete_name));

    // Combine the finals rankings and the filtered semis rankings
    const combinedRankings = [...finalsRankings, ...filteredSemisRankings];

    return combinedRankings;
}

function getCategoryRankings(rounds, category) {
    const categoryScores = {};

    // Aggregate scores for each athlete in the specified category
    rounds.forEach(round => {
        if (round.category === category) {
            round.results.forEach(result => {
                if (!categoryScores[result.athlete_name]) {
                    categoryScores[result.athlete_name] = 0;
                }
                categoryScores[result.athlete_name] += result.total_score;
            });
        }
    });

    // Convert the aggregated scores to an array of objects
    const aggregatedResults = Object.keys(categoryScores).map(athlete_name => ({
        athlete_name,
        total_score: categoryScores[athlete_name]
    }));

    // Sort the aggregated results by total score in descending order
    const sortedResults = aggregatedResults.sort((a, b) => b.total_score - a.total_score);

    return sortedResults;
}

function getRank(athleteName, rounds) {
    const mens = mergeRankings(rounds, categoryNames.MENS_SEMIS, categoryNames.MENS_FINALS);
    const womens = mergeRankings(rounds, categoryNames.WOMENS_SEMIS, categoryNames.WOMENS_FINALS);

    for (let i=0;i<mens.length;i++) {
        if (mens[i].athlete_name.toLowerCase() === athleteName.toLowerCase()) return i+1;
    }

    for (let i=0;i<womens.length;i++) {
        if (womens[i].athlete_name.toLowerCase() === athleteName.toLowerCase()) return i+1;
    }

    return null;
}

function calculateScores(rounds, teams, scoringArray) {
    // Aggregate scores for each athlete across all rounds
    const athleteScores = {};

    rounds.forEach(round => {
        round.results.forEach(result => {
            const leetName = result.athlete_name.toLowerCase();
            if (!athleteScores[leetName]) {
                athleteScores[leetName] = { total_score: 0, rounds: {} };
            }
            athleteScores[leetName].total_score += result.total_score;
            athleteScores[leetName].rounds[round.name] = result.total_score;
        });
    });

    // Convert the aggregated scores to an array of objects
    const aggregatedResults = Object.keys(athleteScores).map(athlete_name => ({
        athlete_name,
        rank: getRank(athlete_name, rounds),
        total_score: athleteScores[athlete_name].total_score,
        rounds: athleteScores[athlete_name].rounds
    }));

    // Sort the aggregated results by total score in descending order
    const sortedResults = aggregatedResults.sort((a, b) => b.total_score - a.total_score);

    // Create a map of athlete names to scores based on ranking
    const athleteRankings = sortedResults.reduce((acc, athlete, index) => {
        acc[athlete.athlete_name] = {
            score: scoringArray[athlete.rank - 1] || 0,
            rounds: athlete.rounds
        };
        return acc;
    }, {});

    // Calculate team scores and structure the final output
    const finalTeams = teams.map(team => {
        let calculated_score = 0;
        if (team.team_name === "Mitt") calculated_score -= 400;

        const athletes = team.competitors.map(competitor => {
            const lowCompetitor = competitor.toLowerCase();
            const athleteData = athleteRankings[lowCompetitor] || { score: 0, rounds: {} };
            calculated_score += athleteData.score;
            return {
                name: lowCompetitor,
                rounds: athleteData.rounds,
                points: athleteData.score
            };
        });
        const sortedAthletes = athletes.sort((a, b) => b.points - a.points);
        return {
            name: team.team_name,
            calculated_score,
            athletes:sortedAthletes
        };
    });

    const sortedTeams = finalTeams.sort((a, b) => b.calculated_score - a.calculated_score);
    return sortedTeams;
}

// const finalTeams = calculateScores(allRounds, teamComposition, scoringArray);
// console.log(finalTeams);
// console.log(finalTeams[0].athletes[0]);

// console.log(getHTMLResults());
// getHTMLResults();

function getHTMLResults() {

    const teamScores = calculateScores(allRounds, teamComposition, scoringArray);

    const medalSrc = ["gold","silver","bronze"];
    const placeTitle = ["1st","2nd","3rd","4th"];
    let htmlCode = "";
    for (let i=0; i<teamScores.length; i++) {
        const currTeam = teamScores[i];
        htmlCode += `<details class="${currTeam.name}">`
        // do stuff
        htmlCode += `<summary>${i < 3 ? `<img src="./climbing/${medalSrc[i]}.JPG" />`: "<div class='fake-medal'></div>"}
            <div class="placement">${placeTitle[i]}</div>
            <div class="team-name">${currTeam.name}</div>
            <div class="team-point-total">${currTeam.calculated_score}</div>
        </summary>`;

        const sortedAthletes = currTeam.athletes.sort((a, b) => b.score - a.score);

        for (let j=0;j<sortedAthletes.length;j++) {
            const athlete = sortedAthletes[j];
            htmlCode += `<div class="athlete">
                <div class="name">${athlete.name}</div>
                <div class="athlete-score">${athlete.points}</div>
            </div>`;
        }
        if (currTeam.name === "Mitt") {
            htmlCode += `<div class="athlete">
                <div class="name">Egregious Behavior</div>
                <div class="athlete-score">-400</div>
            </div>`;
        }

        htmlCode += `</details>`;
    }
    return htmlCode;
}

function sumResults(arr) {
    if (!arr) return 0;
    else return Object.values(arr).reduce((acc, value) => acc + value, 0);
}

function generateRankingsHTML(rankings) {
    let html = '<ul class="rankings">';
    
    rankings.forEach((athlete, index) => {
        html += `<li><span class="name">${index + 1}. ${athlete.athlete_name.toLowerCase()}</span> <span class='score'>${Math.round(athlete.total_score*10)/10}</span></li>`;
    });
    
    html += '</ul>';
    return html;
}

const teamList = document.getElementById("teams-list");
if (teamList) teamList.innerHTML = getHTMLResults();

const mensRankings = mergeRankings(allRounds, categoryNames.MENS_SEMIS, categoryNames.MENS_FINALS);
const womensRankings = mergeRankings(allRounds, categoryNames.WOMENS_SEMIS, categoryNames.WOMENS_FINALS);

const mensList = document.getElementById('mens-ranking');
const womensList = document.getElementById('womens-ranking');

if (mensList) mensList.innerHTML = generateRankingsHTML(mensRankings);
if (womensList) womensList.innerHTML = generateRankingsHTML(womensRankings);