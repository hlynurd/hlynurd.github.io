

 var colors          = ["W",  "U", "B", "R", "G", []];
 var contents = [];
(function($) {
	$.fn.innerText = function(msg) {
		if (msg) {
			if (document.body.innerText) {
				for (var i in this) {
					this[i].innerText = msg;
				}
			} else {
				for (var i in this) {
					this[i].innerHTML.replace(/&amp;lt;br&amp;gt;/gi, "n").replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, "");
				}
			}
			return this;
		} else {
			if (document.body.innerText) {
				return this[0].innerText;
			} else {
				return this[0].innerHTML.replace(/&amp;lt;br&amp;gt;/gi, "n").replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, "");
			}
		}
	};
})(jQuery);

function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return i;   // Found it
        }
    }
    return -1;   // Not found
}

function guild_cidx_to_int(cidx){
    if (cidx[0] == 'U' && cidx[1] == 'W'){
            return 0
    }

    if (cidx[0] == 'B' && cidx[1] == 'U'){
            return 1
    }

    if (cidx[0] == 'B' && cidx[1] =='R'){
            return 2
    }

    if (cidx[0] == 'G' && cidx[1] =='R'){
            return 3
    }

    if (cidx[0] == 'G' && cidx[1] =='W'){
            return 4
    }

    if (cidx[0] == 'B' && cidx[1] =='W'){
            return 5
    }

    if (cidx[0] == 'R' && cidx[1] =='U'){
            return 6
    }

    if (cidx[0] == 'B' && cidx[1] =='G'){
            return 7
    }

    if (cidx[0] == 'R' && cidx[1] =='W'){
            return 8
    }

    if (cidx[0] == 'G' && cidx[1] == 'U'){
            return 9
    }
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];

        if (typeof x == "string")
        {
            x = (""+x).toLowerCase(); 
        }
        if (typeof y == "string")
        {
            y = (""+y).toLowerCase();
        }

        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}

arrSum = function(arr){
  return arr.reduce(function(a,b){
    return a + b
  }, 0);
}

function deterministic_cube(dicts){
	cube_creatures = []
    cube_noncreatures  = []
    found_creatures_by_color = [0, 0, 0, 0, 0, 0]
    found_noncreatures_by_color = [0, 0, 0, 0, 0, 0]
    
    found_cards_guilds_creatures    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    found_cards_guilds_noncreatures = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    found_lands = 0
    cubesize = $('#cubesize').val()
    nlands_min = 0.02 * cubesize
    multi_size = Math.floor(cubesize/140)
    nmultis_creatures = Array(10).fill(multi_size)
    nmultis_spells = Array(10).fill(multi_size)
    bsize=Math.floor((cubesize - multi_size * 20-nlands_min)/12)
    nlands = (cubesize-bsize*12-multi_size*20+nlands_min)
	ncreatures = [bsize, bsize, bsize, bsize, bsize, bsize]
	max_creatures = arrSum(ncreatures)
	nspells =    [bsize, bsize, bsize, bsize, bsize, bsize]
	max_noncreatures = arrSum(nspells)
	mincounts = 1

	cards_from_each_guild = 1
	cube_size = cubesize - cards_from_each_guild*10
    multicolor = cards_from_each_guild
    lands      = false
    
    score_dicts2 = []
    for (var i = 0; i < Object.keys(score_dicts).length; i++){
    	tmp_dict = score_dicts[Object.keys(score_dicts)[i]]
    	tmp_dict["name"] = Object.keys(score_dicts)[i].replace("\"", "").trim()
    	score_dicts2.push(tmp_dict)
    }
    score_dicts = score_dicts2
    
    focus = $('#focus-id').val()

    max_budget = $('#budget-id').val()

    
    ordered_dicts = sortByKey(score_dicts, focus)
    for (var i = 0; i < ordered_dicts.length; i++){
		card = ordered_dicts[i]
		if (card["budget"] > max_budget){continue}
		try{types = json_data["data"][card["name"]][0]["types"]}
		catch(error){
		console.log("problem with", card, error)
		continue}
		cid = json_data["data"][card["name"]][0]["colorIdentity"]
		
		if(textarea_commanders.includes(card["name"])){continue}
		
		if (focus == "score"){
			avg_score = arrSum(card["all_scores"]) / card["all_scores"].length
		    if (avg_score<0.53){
		        continue
		    }
		    if (cedh_staples.includes(card["name"])){
		    	continue
		    }
		}
		
		if (types.includes("Land")){
			if (card["name"].includes("Snow-Covered")){continue}
			if (found_lands < nlands){
			if (types.includes("Creature")){
				cube_creatures.push(card)
			} else {
				cube_noncreatures.push(card)
			}
			found_lands += 1		
			}
		continue
		}
		
		// if: we want to add the card to the cube
		if (card["counts"] >= mincounts){
		
			// first handle the monocolored and colorless cards
			if (cid.length <= 1){
				if (cid.length == 1){
					cidx = colors.indexOf(cid[0])
				} else {
					cidx = 5
				}

				if (types.includes("Creature")){
					if (found_creatures_by_color[cidx] < ncreatures[cidx]){
						cube_creatures.push(card)
						found_creatures_by_color[cidx] += 1
					}
				}
				else {
					if (found_noncreatures_by_color[cidx] < nspells[cidx]){
						cube_noncreatures.push(card)
						found_noncreatures_by_color[cidx] += 1
					}
				}
			}
			// then do the guilds
			if (cid.length == 2){
				cidx = guild_cidx_to_int(cid)
				if (types.includes("Creature")){
					if (found_cards_guilds_creatures[cidx] < nmultis_creatures[cidx]){
						cube_creatures.push(card)
						found_cards_guilds_creatures[cidx] += 1
					}
				}
				else {
					if (found_cards_guilds_noncreatures[cidx] < nmultis_spells[cidx]){
						cube_noncreatures.push(card)
						found_cards_guilds_noncreatures[cidx] += 1
					}
				}
			}
		}

    	if (i>5000 || arrSum(found_creatures_by_color) == max_creatures && arrSum(found_noncreatures_by_color) == max_noncreatures && (arrSum(found_cards_guilds_creatures) + arrSum(found_cards_guilds_noncreatures)) == multi_size*20 && found_lands == nlands){
    		console.log(i>3000, arrSum(found_creatures_by_color) == max_creatures, arrSum(found_noncreatures_by_color) == max_noncreatures,(arrSum(found_cards_guilds_creatures) + arrSum(found_cards_guilds_noncreatures)) == multi_size*20 )
    		console.log("breaking")
    		break
    	}

    	
    }
    console.log(found_cards_guilds_noncreatures, found_cards_guilds_creatures, found_creatures_by_color, found_noncreatures_by_color)
    return cube_creatures.concat(cube_noncreatures)
}

    
    
function gather_all_cards_relevant_to_commanders2(contents){
    score_dicts2 = {}
    for (var k = 0; k < contents.length; k++){
    	con1 = contents[k]
        for (var k2 = 0; k2 < con1["cards"].length; k2++) {
        	card1 = con1["cards"][k2]
            try{card1["name"] in score_dicts2}
            catch(error){continue}
            if (card1["name"] in score_dicts2){

                score_dicts2[card1["name"]]["counts"] +=1
                score_dicts2[card1["name"]]["score"] += Math.pow(card1["cond_prob"], 1.5)
                score_dicts2[card1["name"]]["all_scores"].push(card1["cond_prob"])
                score_dicts2[card1["name"]]["commanders"].push(con1["cname"])
                score_dicts2[card1["name"]]["readable_commanders"].push(con1["rname"])
                
            }
            else{
                score_dicts2[card1["name"]] = {}
                score_dicts2[card1["name"]]["score"] = card1["cond_prob"]
                score_dicts2[card1["name"]]["budget"] = card1["budget"]
                score_dicts2[card1["name"]]["all_scores"] = [card1["cond_prob"]]
                score_dicts2[card1["name"]]["counts"] = 1
                score_dicts2[card1["name"]]["commanders"] = [con1["cname"]]
                score_dicts2[card1["name"]]["readable_commanders"] = [con1["rname"]]
                
            }
        }
    }
    return score_dicts2
}




var json_data;
$(document).ready(function() {
	$.getJSON('json_data.json', function(data) {
		json_data = data; // JSON result in `data` variable
	});
	//  ^------last argument
});



var message; 
var full_cube;

$.ajaxSetup({
    async: false
});

var textarea_commanders;

$(document).ready(function() {
	$(".loader").hide();

	$('#select-id').on('change', function (e) {
		var optionSelected = $("option:selected", this);
		var valueSelected = this.value;
		$("div").removeClass('thick');
   	     $("."+valueSelected).addClass('thick');
	});

	$("#cubemake").click(function() {
		$(".loader").show();
		contents = [];
		var message = $('#commanders_textarea').val();

		a = message.split("\n")
		console.log("tilbuinn", a)
		textarea_commanders =[]; //new Array(a);
		for (cmdr in a){textarea_commanders.push(a[cmdr])}

		for (let i = 0; i < a.length; i++){
			readable_name = String(a[i])
			a[i] = a[i].replaceAll('\'', '')
			a[i] = a[i].replaceAll(',', '')
			a[i] = a[i].replaceAll("\\n", "")
			a[i] = a[i].toLowerCase().trim().replaceAll(" ", "-")
			// XXX: Not everyone is in "cleaned_cardlists" yet, do this offline
			$.getJSON("cubed/cleaned_cardlists/"+ a[i] + ".json", function(data){
				json_obj = JSON.parse(data)
				json_obj["rname"] = readable_name
				contents.push(json_obj);
			}).fail(function(error){
				console.log("An error has occurred.", i, a[i], error);
			});
		}

		score_dicts = gather_all_cards_relevant_to_commanders2(contents)
		// make the cube list
		full_cube = deterministic_cube(score_dicts)
		
		// reset the table
		$('.tg-0lax').text("");
		
		// populate the table with the cube cards
		for (var i = 0; i < full_cube.length; i++){
			card = full_cube[i]["name"]
			if(card !== null && card !== '') {
				cid2 = json_data["data"][$.trim(card)][0]["colorIdentity"]
				types = json_data["data"][$.trim(card)][0]["types"]
				if (types.includes("Creature")){
				    bigtype = "creatures"
				} else {
				    bigtype = "noncreatures"
				}
				
				if (cid2.length > 1){
					cid_tag="multicolored"
				} else if (cid2.length == 0){
					cid_tag="colorless"
				} else {
					cid_tag = cid2[0]
				}
				
				if (types.includes("Land")){
					cid_tag = "lands"
				}
				$("#"+String(bigtype)+"_"+String(cid_tag)).append($('<div></div>').addClass(full_cube[i]["commanders"]).addClass("tooltip").text(String(card)).append($("<span class=\"tooltiptext\"></span>").html(full_cube[i]["readable_commanders"].join(("<br>"))))).append("<br>")

			}	
			
		}
		
		// populate select item with commander names
		
			$('#select-id')
				.find('option')
				.remove()
				.end()
				.append('<option value="nocommanders">None</option>')
				.val('nocommanders');
		
		for (var j = 0; j < contents.length; j++){
			cname = String(contents[j]["cname"])
			

						
			$('#select-id').append($('<option></option>').val(cname).text(String(contents[j]["rname"]))); 
		}
		$(".loader").hide();
	});
});

var cedh_staples = ['Abrade', 'Abrupt Decay', 'Ad Nauseam', 'Ancient Tomb', 'Animate Dead', 'Arbor Elf', 'Arcane Signet', 'Arid Mesa', "Assassin's Trophy", "Avacyn's Pilgrim", 'Aven Mindcensor', 'Badlands', 'Bayou', 'Birds of Paradise', 'Blood Crypt', 'Bloodstained Mire', 'Bloom Tender', 'Brain Freeze', 'Brainstorm', 'Breeding Pool', 'Cabal Ritual', 'Carpet of Flowers', 'Cavern of Souls', 'Cephalid Coliseum', 'Chain of Vapor', 'Chord of Calling', 'Chrome Mox', 'City of Brass', 'City of Traitors', 'Collector Ouphe', 'Command Tower', 'Copy Artifact', 'Counterspell', 'Crop Rotation', 'Culling the Weak', 'Cursed Totem', 'Cyclonic Rift', 'Dark Confidant', 'Dark Ritual', 'Deathrite Shaman', 'Deflecting Swat', 'Delay', 'Demonic Consultation', 'Demonic Tutor', 'Diabolic Intent', 'Dimir Signet', 'Dispel', 'Dockside Extortionist', "Dovin's Veto", 'Dramatic Reversal', 'Drannith Magistrate', "Eladamri's Call", 'Eldritch Evolution', 'Elves of Deep Shadow', 'Elvish Mystic', 'Elvish Spirit Guide', 'Emergence Zone', 'Enlightened Tutor', 'Entomb', 'Eternal Witness', 'Exotic Orchard', 'Faithless Looting', 'Fellwar Stone', 'Fierce Guardianship', 'Finale of Devastation', 'Flooded Strand', 'Flusterstorm', 'Forbidden Orchard', 'Force of Negation', 'Force of Vigor', 'Force of Will', 'Fyndhorn Elves', "Gaea's Cradle", 'Gamble', 'Gemstone Caverns', 'Gilded Drake', 'Gitaxian Probe', 'Godless Shrine', 'Grand Abolisher', "Green Sun's Zenith", 'Grim Monolith', 'Hallowed Fountain', 'Hullbreacher', 'Imperial Recruiter', 'Imperial Seal', 'Intuition', "Inventors' Fair", 'Isochron Scepter', "Jeska's Will", 'Jeweled Lotus', 'Laboratory Maniac', "Lim-Dûl's Vault", "Lion's Eye Diamond", 'Llanowar Elves', 'Lotus Petal', 'Luxury Suite', 'Mana Confluence', 'Mana Crypt', 'Mana Drain', 'Mana Vault', 'Marsh Flats', 'Mental Misstep', 'Merchant Scroll', 'Miscast', 'Misty Rainforest', 'Morphic Pool', 'Mox Amber', 'Mox Diamond', 'Mox Opal', 'Muddle the Mixture', 'Mystic Remora', 'Mystical Tutor', 'Narset, Parter of Veils', "Narset's Reversal", "Nature's Claim", 'Necromancy', 'Necropotence', 'Neoform', 'Noble Hierarch', 'Notion Thief', 'Noxious Revival', 'Nurturing Peatland', 'Opposition Agent', 'Overgrown Tomb', 'Pact of Negation', 'Peer into the Abyss', 'Phantasmal Image', 'Plateau', 'Polluted Delta', 'Ponder', "Praetor's Grasp", 'Preordain', 'Priest of Titania', 'Prismatic Vista', 'Pyroblast', 'Rain of Filth', 'Ranger-Captain of Eos', 'Reanimate', 'Red Elemental Blast', 'Rejuvenating Springs', 'Rhystic Study', 'Rite of Flame', 'Savannah', 'Scalding Tarn', 'Scrubland', "Sensei's Divining Top", "Sevinne's Reclamation", 'Silence', 'Simian Spirit Guide', 'Smothering Tithe', 'Snap', 'Sol Ring', 'Spell Pierce', 'Spellseeker', 'Spire of Industry', 'Steam Vents', 'Stomping Ground', 'Survival of the Fittest', 'Swan Song', 'Swords to Plowshares', 'Sylvan Library', 'Taiga', 'Tainted Pact', 'Talisman of Creativity', 'Talisman of Dominance', 'Talisman of Indulgence', 'Talisman of Progress', 'Tarnished Citadel', 'Temple Garden', "Thassa's Oracle", 'Thrasios, Triton Hero', 'Timetwister', 'Toxic Deluge', 'Training Center', 'Transmute Artifact', 'Tropical Island', 'Tundra', 'Tymna the Weaver', 'Underground River', 'Underground Sea', 'Undergrowth Stadium', 'Underworld Breach', 'Urborg, Tomb of Yawgmoth', 'Utopia Sprawl', 'Vampiric Tutor', 'Veil of Summer', 'Verdant Catacombs', 'Volcanic Island', 'Waterlogged Grove', 'Watery Grave', 'Wheel of Fortune', 'Wheel of Misfortune', 'Wild Growth', 'Windfall', 'Winds of Rebuke', 'Windswept Heath', 'Wishclaw Talisman', 'Wooded Foothills', 'Worldly Tutor', "Yawgmoth's Will"]
