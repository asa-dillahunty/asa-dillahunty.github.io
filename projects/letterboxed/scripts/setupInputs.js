// Get all input fields
const inputs = document.querySelectorAll('.letter-input');

// Add input event listener to each input field
inputs.forEach((input, index) => {
	
	input.addEventListener('keydown', (e) => {
		if (e.key === 'Backspace' && input.value === '') {
			if (index > 0) {
				inputs[index - 1].focus();
			}
			else { // index === 0
				inputs[inputs.length - 1].focus();
			}
			displaySelectSolve();
		}
	});

	input.addEventListener("focus", () => {
		input.select();
	});

	input.addEventListener('input', (e) => {
		// If the input value is not empty and the next input field exists, focus on it
		const inputValue = e.target.value;
		const lastChar = inputValue[inputValue.length - 1];
		if (!/^[a-zA-Z]*$/.test(lastChar)) {
			e.target.value = ''; // Clear the input value if it's not a letter
		}
		else {
			// force lowercase letters
			if (input.value = input.value.toLowerCase());

			if (input.value !== '') input.classList.remove("isEmpty");
			else input.classList.add('isEmpty');

			if (index === inputs.length - 1) {
				inputs[0].focus();
			}
			if (input.value && inputs[index + 1]) {
				inputs[index + 1].focus();
			}
		}
		displaySelectSolve();
	});
});

// also grab our advanced options and set those up
const dictionaryList = [MASSIVE_DICTIONARY,SCRABBLE_DICTIONARY];
const dictSelect = document.querySelector("#advancedOptions select");
let optionBlob = '';
for (let i=0;i<dictionaryList.length;i++) {
	const start = "dictionaries/".length;
	const end = dictionaryList[i].length - ".json".length;
	optionBlob += `<option value="${dictionaryList[i]}">${dictionaryList[i].substring(start,end)}</option>`
}
dictSelect.innerHTML = optionBlob;

function getTodaysPuzzle () {
	// Define the URL of your Google Cloud Function
	const corsProxyURL = 'https://us-central1-cors-forwarding.cloudfunctions.net/corsForwardingProxy';

	// Define the target URL you want to fetch data from
	const targetUrl = 'https://www.nytimes.com/puzzles/letter-boxed';

	// Construct the full URL with the target URL as a query parameter
	const fullUrl = `${corsProxyURL}?url=${encodeURIComponent(targetUrl)}`;

	/*
	// Make a GET request to your Google Cloud Function
	fetch(fullUrl)
		.then(response => {
			// Check if the response was successful
			if (!response.ok) {
			throw new Error('Network response was not ok');
			}
			// Parse the JSON response
			return response.json();
		})
		.then(data => {
			// Process the data returned by the function
			console.log('Data received:', data);
			// Your code to handle the data...
		})
		.catch(error => {
			// Handle errors
			console.error('Error:', error);
		});
	*/

	const NYTurl = "https://www.nytimes.com/puzzles/letter-boxed";
	fetch(NYTurl).then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		// Parse the JSON response
		return response.json();
	}).then( (data) => {
		console.log(data);
		// Do something with the response here
		/* 
			https://www.nytimes.com/puzzles/letter-boxed
			// https://us-central1-cors-forwarding.cloudfunctions.net/corsForwardingProxy
			// https://us-central1-cors-forwarding.cloudfunctions.net/corsForwardingProxy
			// this is in a script that is:
			// 	a sibling of div#pz-game-field
			// 	and child of div#js-hook-pz-moment__game

			// example of a window.gameData ->
			window.gameData = {"id":1930,"expiration":1711177200,"ourSolution":["BLOWFLIES","SUMAC"],"printDate":"2024-03-22","sides":["LME","IUF","WCB","OAS"],"date":"March 22, 2024","dictionary":["ABS","ABACA","ABACUS","ABACUSES","ABEAM","ABLISM","ABSCISE","ABSCISES","ABSCISIC","ABSEIL","ABSEILS","ABULIA","ABOULIA","ABULIC","ABOULIC","ABUSE","ABUSES","ACACIA","ACAI","ACALCULIA","ACE","ACES","AFOUL","AIS","AIL","AILS","AIM","AIMS","AIOLI","ALB","ALBS","ALBA","ALBUM","ALBUMS","ALCAIC","ALCAICS","ALFALFA","ALFOIL","ALIBI","ALIBIS","ALOE","ALOES","ALU","ALOW","ALULA","ALULAE","ALUM","ALUMS","AMBO","AMICE","AMICES","AMICUS","AMICI","AMOEBA","AMOEBAE","AMOEBIC","AMUSE","AMUSES","AUCUBA","AWE","AWES","AWL","AWLS","BAB","BABS","BABA","BABACU","BABACUS","BABE","BABES","BABU","BABUS","BABUL","BABULS","BABIES","BACULUM","BACULA","BAE","BAES","BAI","BAIS","BAIL","BAILS","BAILIE","BAILIES","BAL","BAM","BAMA","BAWL","BAWLS","BEAM","BEAMS","BEAU","BEAUS","BECAUSE","BEFOUL","BEFOULS","BIMA","BEWAIL","BEWAILS","BFS","BIB","BIBS","BIBI","BIBIS","BIBLICAL","BIBLICISM","BIBLICISMS","BIBULOUS","BICE","BILABIAL","BILABIALS","BILAL","BILALS","BILBO","BILBOES","BILBIES","BILIOUS","BIO","BIS","BLAB","BLABS","BLAM","BLOB","BLOBS","BLOC","BLOCS","BLOUSE","BLOUSES","BLOW","BLOWS","BLOWFLIES","BLOWIE","BLOWIES","BLUB","BLUBS","BLUE","BLUES","BOB","BOBS","BOBA","BOBOL","BOBOLS","BOIL","BOILS","BOILIE","BOILIES","BOLO","BOLUS","BOLUSES","BOMA","BOMB","BOMBS","BOMBE","BOMBES","BOUBOU","BOUBOUS","BOW","BOWS","BOWIE","BOWIES","BOWL","BOWLS","BOWSIE","BOWSIES","BUB","BUBAL","BUBALS","BUBO","BUBOES","BUCOLIC","BUCOLICS","BULB","BULBS","BULBIL","BULBILS","BULBOUS","BULBUL","BULBULS","BULIMIA","BULIMIC","BULIMICS","BUM","BUMS","BUMF","BUS","BUSES","BUSBIES","BUSIES","CAB","CABS","CABAL","CABALS","CABALISM","CABOCLO","CACA","CAECUM","CAECA","CECUM","CECA","CAECAL","CECAL","CAFE","CAFES","CALAMUS","CALAMI","CALCES","CALCIC","CALCICOLOUS","CALCULUS","CALCULUSES","CALCULI","CALF","CALICO","CALICOES","CALICES","CAM","CAMS","CAMA","CAMAIL","CAMAILS","CAMBIA","CAMBIAL","CAMI","CAMIS","CAMO","CAUCUS","CAUCUSES","CAUL","CAULS","CAUSE","CAUSES","CAW","CAWS","CEIBA","CEIL","CEILS","CEILI","CEILIS","LAI","CICISBEO","CICISBEI","CILIA","CILICE","CILICES","CIMBALOM","CIMBALOMS","CIS","CISCO","CISCOES","CLAIM","CLAIMS","CLAM","CLAMS","CLAUSE","CLAUSES","CLAW","CLAWS","CLIMB","CLIMBS","CLOU","CLOUS","CLUB","CLUBS","CLUE","CLUES","COB","COBS","COBIA","COCA","COCO","COCOBOLO","COCUS","COIL","COILS","COL","COLS","COLA","COLIC","COLICS","COLISEUM","COLISEUMS","COLOBOMA","COLOBUS","COLIES","COMA","COMAE","COMB","COMBS","COMBE","COMBES","COMBI","COMBIS","COMBO","COMIC","COMICS","COMICAL","COUCAL","COUCALS","COULIBIAC","COULIBIACS","COULIS","COULOMB","COULOMBS","OIL","BOIS","COUSCOUS","COW","COWS","COWL","COWLS","CUB","CUBS","CUBE","CUBES","CUBEB","CUBEBS","CUBIC","CUBICS","CUBICAL","CUBISM","CUE","CUES","CUECA","CULICES","CUM","CUMBIA","CUMULUS","CUMULI","CUMULOUS","CUSCUS","CUSCUSES","CUSEC","CUSECS","ECO","COLI","ECU","ECUS","ESE","ESES","EUCIES","EWE","EWES","FAB","FABS","FABLIAU","FABULOUS","FACE","FACES","FACIAL","FACIALS","FACIES","FACULA","FACULAE","FAECAL","FECAL","FAECES","FECES","FAIL","FAILS","FALSE","FALSIES","FAM","FAMS","FAMILIA","FAMILIAE","FAMILIAL","FAMILISM","FAMILIES","FAMOUS","FAMULUS","FAMULI","FACIA","FAUCES","FAUCIAL","FEIS","FESCUE","FESCUES","FEU","FEUS","FEW","FLAB","FLAIL","FLAILS","FLAM","FLAMS","FLAMBE","FLAMBES","FLAMBEAU","FLAMBEAUS","FLAW","FLAWS","FLIC","FLICS","FLIMFLAM","FLIMFLAMS","FLIMSIES","FLOC","FLOCS","FLOE","FLOES","FLOW","FLOWS","FLU","FLUB","FLUBS","FLUE","FLUES","FLIES","FOB","FOBS","FOCAL","FOCALISE","FOCALISES","FOCUS","FOCUSES","FOCI","FOE","FOES","FOIE","FOIL","FOILS","FOLIA","FOLIACEOUS","FOLIC","FOLIE","FOLIO","FOU","FOUL","FOULS","FOWL","FOWLS","MAI","IAMB","IAMBS","IAMBIC","IAMBICS","IAMBUS","IAMBUSES","IAMBI","IBIS","IBISES","ICE","ICES","ILIAC","ILIACUS","ILIACI","ILIA","IMAM","IMAMS","IMBECILIC","IMBIBE","IMBIBES","IMBO","IMBUE","IMBUES","IMU","IMUS","ALIA","ISM","ISMS","IWI","ALAI","LAB","LABS","LABIA","LABIAL","LABIALS","LABIALISE","LABIALISES","LABLAB","LAC","LACS","LACE","LACES","LAIC","LAICS","LAICAL","LAICISE","LAICISES","LAICISM","LAM","LAMS","LAMA","LAMB","LAMBS","LAMIA","LAMIAE","LAW","LAWS","LIAISE","LIAISES","LIB","LICE","LIE","LIES","LIEF","LIEU","LILAC","LILACS","LILIACEOUS","LILO","LILIES","LIMA","LIMB","LIMBS","LIMBA","LIMBIC","LIMBO","LIMBUS","LIMBI","LIMO","LIMULUS","LIMULI","LIS","LISES","LOB","LOBS","LOBE","LOBES","LOBO","LOBOLA","LOBOLO","LOBSCOUSE","LOCAL","LOCALS","LOCALISM","LOCALISMS","LOCALISE","LOCALISES","LOCI","LOCIE","LOCIES","LOCO","LOCULUS","LOCULI","LOCUM","LOCUMS","LOCUS","LOL","LOLS","LOUSE","LOUSES","LOW","LOWS","LOWE","LOWES","LUAU","LUAUS","LUBE","LUBES","LUCE","LUES","LULU","LULUS","LULS","LUM","LUMS","LUMA","LUSCIOUS","LUSUSES","LUSUS","LWEI","MAC","MACS","MACAW","MACAWS","MACE","MACES","MACULA","MACULAE","MACUMBA","MAIL","MAILS","MAIM","MAIMS","MAIOLICA","MALA","MALAISE","MALAISES","MALI","MALIS","MALIC","MALICE","MALICIOUS","MALIMBE","MALIMBES","MAM","MAMS","MAMA","MAMBA","MAMBO","MAMBOES","MAMIL","MAMILS","CLAUSUM","MAUL","MAULS","MAW","MAWS","MCS","MIAUL","MIAULS","MIC","MICS","MICA","MICACEOUS","MICE","MIL","MILS","MILFOIL","MILFOILS","MILIA","MILIEU","MILIEUS","MILO","MIM","MIMI","MIMIS","MIMIC","MIMICS","MIMULUS","MIMULUSES","MISCUE","MISCUES","MISE","MISUSE","MISUSES","MOB","MOBS","MOBE","MOBES","MOBILISE","MOBILISES","MOBO","MOC","MOCS","MOE","MOFO","MOI","MOIL","MOILS","MOILIES","MOLA","MOLAL","MOLS","MOLIES","MOM","MOMS","MOMISM","MOMO","MOUE","MOUES","MOUSE","MOUSES","MOW","MOWS","MUS","MUCOUS","MUCUS","MUESLI","MUESLIS","MULIES","MULIE","MUM","MUMS","MUMBO","MUMSIES","MUSCAE","MUSCIMOL","MUSE","MUSES","MUSEUM","MUSEUMS","MUSIC","MUSICA","MUSICAL","MUSICALS","MUSICALISE","MUSICALISES","MWA","BOUE","CLAUSUS","OBA","OBI","OBESE","OBIS","OBOE","OBOES","OBOL","OBOLS","OCA","OCULUS","OCULI","OILS","OLIO","OMS","BUCO","OUS","OUMA","OWE","OWES","OWL","OWLS","SEUL","FACIE","UOMO","MALAI","SES","SCAB","SCABS","SCABIES","SCABIOUS","SCABIOUSES","SCALA","SCAM","SCAMS","SCIOLISM","SCOBE","SCOBES","SCOLICES","SCOW","SCOWS","SCOWL","SCOWLS","SCUBA","SCUM","SCUMS","SEA","SEAL","SEALS","SEAM","SEAMS","SEBACEOUS","SEBUM","SEC","SECS","SEI","SEIS","SEISMIC","SEISMICAL","SEISMAL","SEISE","SEISES","SEW","SEWS","SIAL","SIALIC","SIB","SIBS","SIBIA","SIC","SICS","SICE","SICES","SILICA","SILICEOUS","SILICIOUS","SILICIC","SILO","SILOES","SIM","SIMS","SIMA","SIMUL","SIMULS","SIS","SLAB","SLABS","SLALOM","SLALOMS","SLAM","SLAMS","SLAW","SLUE","SLUES","SLICE","SLICES","SLIM","SLIMS","SLOB","SLOBS","SLOE","SLOES","SLOMO","SLOW","SLOWS","SLUB","SLUBS","SLUM","SLUMS","SMILIES","BOL","SUB","SUBS","SUBFAMILIES","SUBSEA","SUE","SUES","SULCUS","SULCI","SULFA","SULU","SULUS","SUM","SUMS","SUMAC","SUMACS","SUMI","SUMO","SUS","SWAB","SWABS","SWOB","SWOBS","SWAM","SWAMI","SWAMIS","SWIM","SWIMS","SWUM","SWIES","OEIL","UBAC","UBACS","UBE","UBI","UBES","UBIS","ULAMA","ULU","ULUS","UMAMI","UMBILICAL","UMBILICALS","UMBILICUS","UMBILICI","UMBILICUSES","UMBO","UMU","UMUS","USE","USES","USUAL","USUALS","WABI","WAWA","WAIL","WAILS","WALI","WALIS","WAUL","WAULS","WEAL","WEALS","WEB","WEBS","WEBMAIL","WEI","WILCO","WIS","WISE","WISES","WOE","WOES","WOLF","WOLFS","WOMA","WOMB","WOMBS","WOW","WOWS","WOWSE","WOWSES","BOLA","CLOMB","CLUBFACE","CLUBFACES","LAMBIC","OIS","SULFAMIC","ABAC","ABACS","ABACULUS","ABACULUSES","ABLOW","ABLO","ABOB","ABOIL","ABOMA","ACAULOUS","ACAUSE","ACICULA","ACICULUS","ACICULUM","ACIES","ACOUSMA","AECIAL","AEFAUL","AFLOW","AFOCAL","AIE","ALALA","ALALIA","ALC","ALCABALA","ALCE","ALCES","ALCEA","ALIM","ALIMS","ALISMA","ALISMACEOUS","ALUMIC","AULA","AULIC","AULICAL","AULICISM","AULICISMS","AUM","AUMS","AUMUCE","BABACO","BABESIAL","BALOI","BALOIS","BIOFACIES","BIOFACIESES","BOE","BOMO","BUBA","BULIMIOUS","BUSE","BUCU","CUSUM","CUSUMS","ECOMUSEUM","ECOMUSEUMS","FAE","FALCIAL","FAMILIC","FLOB","FLOBS","ALSE","LACIS","LAWSIES","LIMICOLOUS","LIWA","LOCOFOCOISM","LOCOFOCOISMS","LOCULOUS","LOLA","LOLO","LOWIES","MAB","MABE","MABES","MACA","MACOUBA","MAILO","MAIMAI","MAIMAIS","MAISE","MAISES","MALACIA","MALACIC","MALAE","MALAES","MALAMBO","MALOMBO","MALF","MALOCA","MOLOMBO","MAMBU","MAMBUS","MAUMAU","MAUM","MAUMS","MAWLA","MAULA","MBILA","MBUBE","MBOUBE","MIE","MIAI","MIAIS","MICACIOUS","MIESIES","MIESIESES","MILICE","MILICES","MIMIAMB","MIMIAMBS","MIMIAMBUS","MIMIAMBUSES","MIMICAL","MIOMBO","MIOMBA","MISCLAIM","MISCLAIMS","MISL","MISLS","MISMAE","MISCAL","MOBISM","MOBESE","MOBESES","MOBILISM","MOBILISMS","MOBOLA","MOBIE","MOBIES","MOCO","MOCUS","MOLIE","MOLIMO","MOLO","MOWLOW","MOLOI","MOLOIS","MOLUE","MOLUES","MOMIE","MOMIES","MOULIE","MOU","MOUS","MOUL","MOL","MOULS","MOUSEWEB","MOUSEWEBS","MOWIE","MULAI","MULAIS","MULISM","MULISMS","MUSCICOLOUS","MUSCULOUS","MUSCULUS","MUSCULUSES","MUSEAU","MUSEUMISE","MUSICO","OBO","OBOLUS","OBULUS","OBOLUSES","OLA","OLAMIC","OLIM","OMBU","OMBUS","OMI","OMIS","OMIE","OMIAI","OMIAIS","OMUL","OMULS","OUABAIO","OUMIESIES","OUSIA","OWIE","OWIES","OWLISM","OWLISMS","SUBA","SUBFACE","SUBFACES","SUBFACIES","SUBFACIESES","SUBFEU","SUBFEUS","SUBICULUM","SUBICULUMS","SUBLIMISE","SUBMUCOUS","SUBUCULA"],"par":4,"yesterdaysSolution":["FAZED","DOWNVOTING"],"yesterdaysSides":["ANO","GDV","IEF","WZT"],"isFree":false,"editor":"Sam Ezersky","editorImage":"https:\u002F\u002Fstorage.googleapis.com\u002Fnyt-games-prd.appspot.com\u002Favatars\u002Fsam-ezersky.png"}
		*/
		console.log(response);
		console.log(response.querySelector("#js-hook-pz-moment__game script"))
	}).catch((error) => {
		console.log(error);
	});
}