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
            "Mackenzie Oceana",
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
            "Yuetong Zhang",
            "Raboutou Brooke",
            "Chae-hyun Seo",
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
            "Zhilu Luo",
            "Dorffel Lucia"
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
            "Kazbekova Jenya",
            "Krampl Mia",
            "Moroni Camilla",
            "Rogora Laura"
        ]
    }
]

const scoringArray = [150, 125, 100, 60, 50, 40, 35, 30, 15, 12, 10, 10, 10, 5, 5, 5, 5, 3, 1, -25];

const allRounds = [];
const mensBoulderSemis = [
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
];
// mensBoulderSemis.push({"athlete_name":"LEHMANN Sascha", "total_score":100})

function calculateTeamScores(results, teams, scoringArray) {
    const aggregatedScores = results.reduce((acc, athlete) => {
        if (!acc[athlete.athlete_name]) {
            acc[athlete.athlete_name] = 0;
        }
        acc[athlete.athlete_name] += athlete.total_score;
        return acc;
    }, {});

    // Convert the aggregated scores to an array of objects
    const aggregatedResults = Object.keys(aggregatedScores).map(athlete_name => ({
        athlete_name,
        total_score: aggregatedScores[athlete_name]
    }));

    // Sort the aggregated results by total score in descending order
    const sortedResults = aggregatedResults.sort((a, b) => b.total_score - a.total_score);

    // Create a map of athlete names to scores
    const athleteScores = sortedResults.reduce((acc, athlete, index) => {
        acc[athlete.athlete_name.toLowerCase()] = scoringArray[index] || 0;
        return acc;
    }, {});

    console.log(athleteScores);

    // Calculate team scores
    const teamScores = teams.map(team => {
        let totalScore = 0;
        const athletes = [];
        team.competitors.forEach(competitor => {
            const competitor_name_lower = competitor.toLowerCase();

            
            if (athleteScores[competitor_name_lower]) {
                athletes.push({ name:competitor_name_lower, score: athleteScores[competitor_name_lower] });
                totalScore += athleteScores[competitor_name_lower];
            }
            else {
                athletes.push({ name:competitor_name_lower, score: 0 });
            }
        });
        return { team_name: team.team_name, score: totalScore, athletes: athletes};
    });

    return teamScores;
}

const teamScores = calculateTeamScores(mensBoulderSemis, teamComposition, scoringArray);
const sortedTeams = teamScores.sort((a, b) => b.score - a.score);

const medalSrc = ["gold","silver","bronze"];
const placeTitle = ["1st","2nd","3rd","4th"];
let htmlCode = "";
for (let i=0; i<teamScores.length; i++) {
    const currTeam = teamScores[i];
    htmlCode += `<details class="${currTeam.team_name}">`
    // do stuff
    htmlCode += `<summary>${i < 3 ? `<img src="${medalSrc[i]}.JPG" />`: "<div class='fake-medal'></div>"}
        <div class="placement">${placeTitle[i]}</div>
        <div class="team-name">${currTeam.team_name}</div>
        <div class="team-point-total">${currTeam.score}</div>
    </summary>`;

    const sortedAthletes = currTeam.athletes.sort((a, b) => b.score - a.score);

    for (let j=0;j<sortedAthletes.length;j++) {
        const athlete = sortedAthletes[j];
        htmlCode += `<div class="athlete">
            <div class="name">${athlete.name}</div>
            <div class="athlete-score">${athlete.score}</div>
        </div>`;
    }

    htmlCode += `</details>`;
}
console.log(htmlCode);