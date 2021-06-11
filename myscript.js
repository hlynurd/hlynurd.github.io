
 // TODO: Make hover-over on cards to show the list of associated commanders
 // TODO; Make a drop-down list of commanders to highlight their associated cards
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
    
    // TODO: Include guild cards
    found_cards_guilds_creatures    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    found_cards_guilds_noncreatures = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    found_lands = 0
    cubesize = $('#cubesize').val()
    multi_size = Math.floor(cubesize/100)
    nmultis_creatures = Array(10).fill(multi_size)
    nmultis_spells = Array(10).fill(multi_size)
    bsize=Math.floor((cubesize - multi_size * 20)/12)
    nlands = (cubesize-bsize*12-multi_size*20)
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
    //console.log("the length", ordered_dicts.length)
    for (var i = 0; i < ordered_dicts.length; i++){
		card = ordered_dicts[i]
		if (card["budget"] > max_budget){continue}
		try{types = json_data["data"][card["name"]][0]["types"]}
		catch(error){
		console.log("problem with", card, error)
		continue}
		cid = json_data["data"][card["name"]][0]["colorIdentity"]
		//console.log("ding dong", i, card, types, cid)
		
		if (types.includes("Land")){
			if (found_lands < nlands){
						console.log("yes")
			if (types.includes("Creature")){
				cube_creatures.push(card)
			} else {
				console.log("adding", card, "to noncreatures")
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
                score_dicts2[card1["name"]]["score"] += card1["cond_prob"]
                if (card1["cond_prob"] > score_dicts2[card1["name"]]["max_score"]){
                	score_dicts2[card1["name"]]["max_score"] = card1["cond_prob"]
                }
                score_dicts2[card1["name"]]["commanders"].push(con1["cname"])
                score_dicts2[card1["name"]]["readable_commanders"].push(con1["rname"])
                
            }
            else{
                score_dicts2[card1["name"]] = {}
                score_dicts2[card1["name"]]["score"] = card1["cond_prob"]
                score_dicts2[card1["name"]]["budget"] = card1["budget"]
                score_dicts2[card1["name"]]["max_score"] = card1["cond_prob"]
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

$(document).ready(function() {
	$(".loader").hide();

	$('#select-id').on('change', function (e) {
		var optionSelected = $("option:selected", this);
		var valueSelected = this.value;
		$("div").removeClass('thick');
   	     $("."+valueSelected).addClass('thick');
	});

	$("#cat").click(function() {
		$(".loader").show();
		contents = [];
		var message = $('#catmessage').val();

		a = message.split("\n")

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
					console.log("adding somewhere", card, bigtype)
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
		
		for (var j = 0; j < contents.length; j++){
			cname = String(contents[j]["cname"])
			$('#select-id').append($('<option></option>').val(cname).text(String(contents[j]["rname"]))); 
		}
		$(".loader").hide();
	});
});

