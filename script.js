//Known issues
//Resolution of text blurry - could fix CBA: https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
//The Overlap functionality could be stripped out and just use Redraw paths, overlapping isn't really a massive deal
//changing board Size makes new deployment Zones of same inch size look wrong. DON'T CARE
var colours = ["#c2191f","#4166f5","#471f5f","#9c6b08","#c2191f","#4166f5","#301934","#9c6b08"];


// calculateSize sets these values to the width  / height in pixels of the canvas map, height is always half of width.
var width = 0; 
var height = 0;
//Set board size sets the below values in inches to whatever the selected board sizes value is
var boardWidth= 0;
var boardHeight=0;
//used for controlling lengths and depths etc
var edge;
var edgeName;
var maxLength;
var zLength;
var zLengthA;
var zLengthB;
//inch to PX calculates how many Pixels represent our imaginary "Inch", which will vary depending on height and width. 
var inchHeight=0;
var inchWidth=0;
//Drawing
var cDraw = true;
var dWidth;
var dHeight;
var dZoneLength;
var dZoneWidth;
var dShape;
var dPosition;
///Below values are used to store the values of the deployment zone being edited 
var editing = false;
//for assigning and associating with deployment zones
var depZoneId = 0;
var curDep;

// for checking for overlaps

var desStartHeight;
var desEndHeight;
var desStartWidth; 
var desEndWidth;
//Used for Saving purposes working out whether to create a new deployment zone or not
var depExists = false;
var oldColour;
var cEdge = "ignore";
var cHeight;
var cWidth;
var objCount = 0;
var obExists = false;
var curObSH = 100000;
var curObSW = 100000;
var curOb = 100000;
	curObStartH = 1000000;
	curObStartW= 1000000;
var centreReq = false;	
var exExists = false;
var curEx = 1;
var existingEx;
var tabActive = "setup";
var maptype = "map";
$( document ).ready(function() {
	ctx = canvas.getContext('2d');
	ctx.textAlign = "center";
	ctx.lineWidth = 7;
			ctx.font  = "50px Orbitron, Arial";

	edge = $("#boardEdge").val();
    reStyle();
	setBoardSize();
	calculateSize();
console.log("ready");

	    ClassicEditor
        .create( document.querySelector( '#missionBriefText' ) )
        .catch( error => {
            console.error( error );
        } );
			    ClassicEditor
        .create( document.querySelector( '#missionRulesText' ) )
        .catch( error => {
            console.error( error );
        } );
			    ClassicEditor
        .create( document.querySelector( '#primaryObjectivesText' ) )
        .catch( error => {
            console.error( error );
        } );
			    ClassicEditor
        .create( document.querySelector( '#secondaryObjectivesText' ),{fontFamily: {  options: [
                'sans-serif'
		]} })
        .catch( error => {
            console.error( error );
        } );
		
	$(".shower").click(function()
	{
		showStuff();
	});
		$(".hider").click(function()
	{
		hideStuff(this);
	});
	$("#download").click(function()
	{

	getPDF();

    });
	$("#maptab").click(function()
	{
		$("#mapContainerContainerContainer").show();
		$("#boardSetupContainerContainer").hide();

	});
	$("#desctab").click(function()
	{
			$("#mapContainerContainerContainer").hide();
		$("#boardSetupContainerContainer").show();
	});
	
		
		$("#missionDeetz").click(function()
		{
				if (tabActive != "deetz")
		{
			tabActive = "deetz";
					$("#deetz").show();
					$("#previewdownload").hide();
									$("#setupContainer").hide();
		}



		});
	
	$("#setup").click(function()
	{
		if (tabActive != "setup")
		{
			tabActive = "setup";
		$("#previewdownload").hide();
		$("#deetz").hide();
		$("#setupContainer").show();
		$("#boardSetupContainerContainer").append($("#boardSetup").parent());
		$("#mapContainerContainer").append($("#mapContainer"));

		}
	});


			$("#preview").click(function()
	{
		if (tabActive != "preview")
		{
		tabActive = "preview";
			$("#boardSetupContainerContainer").append($("#boardSetup").parent());
		$("#mapContainerContainer").append($("#mapContainer"));
		$("#previewdownload").show();
		$("#setupContainer").hide();
				$("#deetz").hide();

		$("#mName").empty();
		$("#mbriefing").empty();
		$("#mrules").empty();
		$("#mprimary").empty();
		$("#msecondary").empty();
		$("#mboardsetup").empty();
		$("#mboard").empty();
		
		$("#mName").append('<h3>'+$("#missionName").val()+'</h3>');
		var brief = $("#missionBriefing").find($(".ck-content"));
		if (brief.text().length > 0)
		{
			
		$("#mbriefing").append(	'<div class="card text-white bg-secondary mb-3"><div class=" card-title">Mission Briefing</div><div class="card-body">'+brief.html()+'</div></div>');
		}
			var rules = $("#missionRules").find($(".ck-content"));
		if (rules.text().length > 0)
		{
		$("#mrules").append(	'<div class="card text-white bg-secondary mb-3"><div class=" card-title">Mission Rules</div><div class="card-body">'+rules.html()+'</div></div>');
		}
				var primaryObjectives = $("#primaryObjectives").find($(".ck-content"));
		if (primaryObjectives.text().length > 0)
		{
		$("#mprimary").append(	'<div class="card text-white bg-secondary mb-3"><div class=" card-title">Primary Objectives</div><div class="card-body">'+primaryObjectives.html()+'</div></div>');
		}
						var secondaryObjectives = $("#secondaryObjectives").find($(".ck-content"));
		if (secondaryObjectives.text().length > 0)
		{
		$("#msecondary").append(	'<div class="card text-white bg-secondary mb-3"><div class=" card-title">Secondary Objectives</div><div class="card-body">'+secondaryObjectives.html()+'</div></div>');
		}
		

		if ($(".itemdescriber").length > 0)
		{
		$("#mboardsetup").append($("#boardSetup").parent());
		}
		$("#mboard").append($("#mapContainer"));
		}
		


	});

$("#exclusionBoxAdd").click(function()
{
checkBoxSizes();	

exBoxStartCalc();	

checkExBoxes();
tryExBox();
});
$("#addDep").click(function()
{
	if (!depExists)
	{
		$("#boardEdge").val("ignore");
		//boxOptions
				
	}
});
$("#cornerEdge").click(function()
{
	if (!depExists)
	{
		$("#boardEdge").val("ignore");
				
	}
});
$( "#objectiveadd" ).click(function() 
{
	//console.log("addClicked");
$( "#addObjectiveFrom > option" ).each(function(){
{
	$(this).remove();
}

});
$('#addObjectiveFrom').append($('<option>', {
    value: "ignore",
    text: 'Select',
	startwidth:"ignore",
	startheight:"ignore",
	selected:1
		, hideOpt:"none"
}));
$('#addObjectiveFrom').append($('<option>', {
    value: "board",
    text: 'Top left of board',
	startwidth:0,
	startheight:0,
	heightName:"Top",
	widthName:"Left",
		dheightName:"Top",
	dwidthName:"Left",
	maxwidth:2000,
	maxheight:1000
	, hideOpt:"none"

}));
$('#addObjectiveFrom').append($('<option>', {
    value: "board",
    text: 'Top right of board',
	startwidth:2000,
	startheight:0,
	heightName:"Top",
	widthName:"Right",
		dheightName:"Top",
	dwidthName:"Right",
	maxwidth:2000,
	maxheight:1000	, hideOpt:"none"
}));
$('#addObjectiveFrom').append($('<option>', {
    value: "board",
    text: 'Bottom left of board',
	startwidth:0,
	startheight:1000,
	heightName:"Bottom",
	widthName:"Left",
		dheightName:"Bottom",
	dwidthName:"Left",
	maxWidth:2000,
	maxHeight:1000	, hideOpt:"none"
}));
$('#addObjectiveFrom').append($('<option>', {
    value: "board",
    text: 'Bottom right of board',
	startwidth:2000,
	startheight:1000,
	heightName:"Bottom",
	widthName:"Right",
		dheightName:"Bottom",
	dwidthName:"Right",
		maxwidth:2000,
	maxheight:1000	, hideOpt:"none"
}));

$('#addObjectiveFrom').append($('<option>', {
    value: "Centre",
    text: 'Up from centre of battlefield',
	startwidth:1000,
	startheight:500,
	heightName:"Bottom",
	widthName:"Left",
		dheightName:"Up",
	dwidthName:"Left",
	maxwidth:2000,
	maxheight:1000
	, hideOpt:"w"

}));
$('#addObjectiveFrom').append($('<option>', {
    value: "Centre",
    text: 'Down from centre of battlefield',
	startwidth:1000,
	startheight:500,
	heightName:"Top",
	widthName:"Left",
		dheightName:"Down",
	dwidthName:"Left",
	maxwidth:2000,
	maxheight:1000
	, hideOpt:"w"

}));
$('#addObjectiveFrom').append($('<option>', {
    value: "Centre",
    text: 'Right from centre of battlefield',
	startwidth:1000,
	startheight:500,
	heightName:"Top",
	widthName:"Left",
		dheightName:"Down",
	dwidthName:"Right",
	maxwidth:2000,
	maxheight:1000
	, hideOpt:"h"

}));
$('#addObjectiveFrom').append($('<option>', {
    value: "Centre",
    text: 'Left from centre of battlefield',
	startwidth:1000,
	startheight:500,
	heightName:"Top",
	widthName:"Right",
		dheightName:"Down",
	dwidthName:"Left",
	maxwidth:2000,
	maxheight:1000
	, hideOpt:"h"

}));
$(".obEdit").each(function()
{
			$('#addObjectiveFrom').append($('<option>', {
		value: $(this).text(),
		text: 'From left of '+$(this).text(),
		startwidth:parseInt($(this).attr("width"))-60,
		maxwidth:parseInt(difference(2000,width))-60,
		startheight:$(this).attr("height"),
		maxheight:$(this).attr("height"),
		heightName:"Top",
		widthName:"Right",
		dheightName:"Top",
		dwidthName:"Left",
		hideOpt:"h"
}));
			$('#addObjectiveFrom').append($('<option>', {
		value: $(this).text(),
		text: 'From right of '+$(this).text(),
		startwidth:parseInt($(this).attr("width"))+60,
		maxwidth:parseInt(difference(0,width))+60,
		startheight:$(this).attr("height"),
		maxheight:$(this).attr("height"),
		heightName:"Top",
		widthName:"Left",
		dheightName:"Top",
		dwidthName:"Right",
		hideOpt:"h"
}));
			$('#addObjectiveFrom').append($('<option>', {
		value: $(this).text(),
		text: 'From top of '+$(this).text(),
		startwidth:$(this).attr("width"),
	startwidth:$(this).attr("width"),
		startheight:parseInt($(this).attr("height"))-60,
		maxheight:parseInt(difference($(this).attr("height"),0))-60,
		heightName:"Bottom",
		widthName:"Left",
		dheightName:"Top",
		dwidthName:"Left",
		hideOpt:"w"
}));
			$('#addObjectiveFrom').append($('<option>', {
		value: $(this).text(),
		text: 'From bottom of '+$(this).text(),
		startwidth:$(this).attr("width"),
	startwidth:$(this).attr("width"),
		startheight:parseInt($(this).attr("height"))+60,
		maxheight:parseInt(difference($(this).attr("height"),2000))+60,
		heightName:"Top",
		widthName:"Left",
		dheightName:"Bottom",
		dwidthName:"Left",
		hideOpt:"w"
}));
});
$(".depZ").each(function()
{
	//if (depExists && $(this).attr("zoneid") == cur
	if ($(this).hasClass("box"))
	{
		var minWidth = parseInt($(this).attr("minwidth"));
		var maxWidth = parseInt($(this).attr("maxwidth"));
		var minHeight = parseInt($(this).attr("minheight"));
		var maxHeight = parseInt($(this).attr("maxheight"));
			var zoneHeight = parseInt($(this).attr("dzoneheight"));
		var zoneWidth = parseInt($(this).attr("dzonewidth"));
		if(minWidth >= inchWidth)
		{
		console.log("can add from left");
		$('#addObjectiveFrom').append($('<option>', {
		value: $(this).text(),
		text: 'From left of '+$(this).text(),
		startwidth:minWidth,
		maxwidth:difference(0,minWidth),
		startheight:minHeight,
		maxheight:zoneHeight,
		heightName:"Top",
		widthName:"Right",
		dheightName:"Top",
		dwidthName:"Left"	, hideOpt:"none"
}));
	
		}
		if (maxWidth <=(2000 - inchWidth))
		{
		$('#addObjectiveFrom').append($('<option>', {
		value: $(this).text(),
		text: 'From right of '+$(this).text(),
		startwidth:maxWidth,
		maxwidth:2000-maxWidth,
		startheight:minHeight,
		maxheight:zoneHeight,
		heightName:"Top",
		widthName:"Left",
		dheightName:"Top",
		dwidthName:"Right"	, hideOpt:"none"
}));
		console.log("can add from right");
		}
		if (maxHeight <=(1000 - inchHeight))
			//from bottom
		{
		$('#addObjectiveFrom').append($('<option>', {
		value: $(this).text(),
		text: 'From bottom edge of '+$(this).text(),
		startwidth:minWidth,
		maxwidth:zoneWidth,
		startheight:maxHeight,
		maxheight:1000-maxHeight,
		heightName:"Top",
		widthName:"Left",
		dheightName:"Bottom",
		dwidthName:"Left"	, hideOpt:"none"
}));
		}				
		
		if (minHeight >=( inchHeight))
		{
		$('#addObjectiveFrom').append($('<option>', {
		value: $(this).text(),
		text: 'From top of '+$(this).text(),
		startwidth:minWidth,
		maxWidth:zoneWidth,
		startheight:minHeight,
		maxheight: difference(minHeight, 0),
		heightName:"Bottom",
		widthName:"Left",
		dheightName:"Top",
		dwidthName:"Left"	, hideOpt:"none"
}));
		}
	}
});
if (obExists)
{
$( "#addObjectiveFrom > option" ).each(function()
{
	if ($(this).attr("startwidth") == curObStartW && $(this).attr("startheight") == curObStartH)
	{
		//console.log("bingo");
		//$(this),attr("selected", true);
		  $("#addObjectiveFrom").val($(this).val());
		var selectedText = $(this).text();
		$(function() {
    $('#addObjectiveFrom option').filter(function() { 
        return ($(this).text() == selectedText); //To select Blue
    }).prop('selected', true);
	setFromTo($("#addObjectiveFrom"));
	//trySetOb();
	  
})

	}
	
	
});
console.log($("#addObjectiveFrom").val());

}
else
{
	$("#obFromTo").hide();
}
});
	$(".exCircleEdit").change(function(){
		
tryCircle();
		});
	$( "#addObjectiveFrom" ).change(function() 
	{
		if ($( "#addObjectiveFrom" ).val() == "ignore")
		{	
		$("#obFromTo").hide();
		$("#saveObContainer").hide();
		}
		else{
		$("#obFromTo").show();
		$("#saveObContainer").show();
		setFromTo($(this));
		}
	});
	
$( "#boardSize" ).change(function() 
{
	setBoardSize();
    calculateSize();
});
$( ".exitCurrent" ).click(function() 
{
var isEdit = false;
depExists = false;
obExists = false;
exExists = false;
	reCreatedepZ(isEdit);
	

	});
$( ".obToggle" ).click(function() 
{
	//twtoggle$(".obE").toggle();
	//console.log("obE");
});
$(".exCE").click(function()
{
	//twtoggle$(".exCToggle").toggle();
	
});
$(".exBE").click(function()
{
	//twtoggle$(".exBToggle").toggle();
	
});

$("#exclusionCircleAdd").click(function()
{
	if (!exExists)
	{
	$("#circleH").val(boardHeight/2);
	$("#circleW").val(boardWidth/2);
	}
	tryCircle();

});

$( ".depToggle" ).click(function() 


{
	if ($(this).hasClass("box"))
	{
//twtoggle$("#addCornerDep").toggle();

		
//twtoggle$("#addDep").toggle();
//twtoggle$("#depZone").toggle();
	}
	else
	{
		//twtoggle$("#addCornerDep").toggle();		
//twtoggle$("#addDep").toggle();
//twtoggle$("#cornerDepZone").toggle();
//twtoggle$("#saveDepC").hide();


	}
});

	
$(".exBoxEdit").change(function()
{
checkExBoxes();
});
$("#zoneLength").change(function()
{
setLengths();
});
$( ".cornerChange" ).change(function() 
{
	 cHeight = 0;
	 cWidth = 0;

	if ((!$(this).val()) || parseInt($(this).val() < 0))
	{
		$(this).val(0);
	}
	if ($(this).attr("id") == "cornerHeight")
	{
		//console.log("h");
		if (parseInt($(this).val()) > boardHeight)
		{
			$(this).val(boardHeight);
		}
		cHeight = parseInt($(this).val());
		if ((!$("#cornerLength").val()) || parseInt($("#cornerLength").val() < 0))
			{
				$("#cornerLength").val(0);
			}
				if (parseInt($("#cornerLength").val()) > boardWidth)
		{
			$("#cornerLength").val(boardWidth);
		}
		
		cWidth = parseInt($("#cornerLength").val());
		
		
	}
	else
	{
			//console.log("w");
		if (parseInt($(this).val()) > boardWidth)
		{
			$(this).val(boardWidth);
		}
		cWidth = parseInt($(this).val());
		if ((!$("#cornerHeight").val()) || parseInt($("#cornerHeight").val() < 0))
			{
				$("#cornerHeight").val(0);
			}
				if (parseInt($("#cornerHeight").val()) > boardHeight)
		{
			$("#cornerHeight").val(boardHeight);
		}
		
		cHeight = parseInt($("#cornerHeight").val());
	}
	checkCorner();
});
$("#circleFromCentre").click(function()
{
	if ($(this).prop("checked") == true)
	{
		$("#circleH").val(boardHeight/2);
		$("#circleW").val(boardWidth/2);
		$("#circlesizes").hide();
	}
	else
	{
			$("#circlesizes").show();
	}
	tryCircle();
});
$( "#cornerEdge" ).change(function() 
{ 
cEdge = $("#cornerEdge").val();
if (cEdge != "ignore")
{
	$("#cornerOptions").show();
	if (!$("#cornerHeight").val())
	{
		$("#cornerHeight").val(0);

	}
		if (!$("#cornerLength").val())
		{
		$("#cornerLength").val(0);
		}

}
else
{
		$("#cornerOptions").hide();

}
	checkCorner();

});
$("#boxfromCentre").change(function(){
	exBoxStartCalc();
checkExBoxes();
tryExBox();	

});
$(".exStart").change(function()
{
	checkExBoxes();
tryExBox();

});
$(".exChangeStart").change(function(){
checkBoxSizes();	

exBoxStartCalc();	

checkExBoxes();
tryExBox();
});
$( "#boardEdge" ).change(function() 
{
	edge = $("#boardEdge").val();
	edgeName = $("#boardEdge option:selected").text();
	$("#offSetEdgeLabel").text(edgeName);

	if ($("#boardEdge").val() != "ignore")
	{	
		$("#boxOptions").show();
		if ($("#offSetEdge").val().length === 0)
		{
		$("#offSetEdge").val(0);
		}
		if ($("#offSetSide").val().length === 0)
		{
		$("#offSetSide").val(0);
		}		
		if ($("#zoneDepth").val().length === 0)
		{
		$("#zoneDepth").val(9);
		}	
		if  ( edge == "t" || edge == "b")
		{
			$("#fromALabel").text(" Left");
			$("#fromBLabel").text(" Right");

			if($("#zoneLength").val().length === 0 || $("#zoneLength").val() >= boardWidth ||$("#zoneLength").val() == boardHeight 	)
			{
			$("#zoneLength").val(boardWidth);

				$("#fromInputs").hide();
			}
		}
		else if  (edge == "l" || edge == "r")
		{
			$("#fromALabel").text(" Top");
			$("#fromBLabel").text(" Bottom");
		if($("#zoneLength").val().length === 0 || $("#zoneLength").val() >= boardHeight)
		{
		$("#zoneLength").val(boardHeight);
		
	$("#fromInputs").hide();
		}
		}
		setLengths();
		addBox();
		//reCreatedepZ(editing, true, "box");


	}
	else
	{
		$("#boxOptions").hide();
	}

});
$( ".boxChange" ).change(function() 
{
	//console.log("boxchange");
//reCreatedepZ(editing, true, "box");

addBox();
	
});

$( ".offSetCounter" ).change(function() 
{

setOffSet(this);	
});

});

$( window ).resize(function() 
{
	//window size has changed so adjust map
    calculateSize();
});
function setLengths()
{
	zLength = parseInt($("#zoneLength").val());
if (edge == "t" || edge == "b")
{
	maxLength = parseInt(boardWidth);
}
else if (edge == "r" || edge == "l")
{
	maxLength = parseInt(boardHeight);
}
else
{
	maxLength = 0;
}

if (zLength >= maxLength)
{
	$("#fromA").val(0);
	$("#fromB").val(0);
}
if (zLength > maxLength)
{
$("#zoneLength").val(maxLength);
}
if (zLength < maxLength)
{
var guy = $("#fromA");	
setOffSet(guy);	
$("#fromInputs").show();

	}
	else
{
	var guy = $("#fromA");	
setOffSet(guy);	
		$("#fromInputs").hide();
		
}


}
function checkCorner()
{
	
	 cHeight =  parseInt($("#cornerHeight").val()); 
	 cWidth =  parseInt($("#cornerLength").val()); 
	if (
		cHeight > 0 && cHeight <= boardHeight
		&&
		cWidth > 0 && cWidth <= boardWidth
		&&
		cEdge != "ignore"
		)
		{
			//console.log("ok to create Corner");
			if (editing == false)
		{
		recountDeps();
		curDep = depZoneId;
		editing = true;
		//console.log(depZoneId);
		}
		
		$("#saveDepC").show();
		
$('#hiddenCornerDep').replaceWith('<div id="hiddenCornerDep" zoneid="' + curDep +'" corneredge="'+cEdge+'" cornerheight="'+cHeight+'" cornerwidth = "'+cWidth+'"> </div>');
			reCreatedepZ(editing,true,"corner");
		}
		else
		{
			$("#saveDepC").hide();
		}
}
function trySetOb()
{

	var heightName = $("#addObjectiveFrom").find(':selected').attr('heightName');
	var widthName = $("#addObjectiveFrom").find(':selected').attr('widthName');
	var startHeight = parseInt($("#addObjectiveFrom").find(':selected').attr('startHeight'));
	var startWidth = parseInt($("#addObjectiveFrom").find(':selected').attr('startWidth'));
	var height = parseInt($("#addObjectiveFrom").find(':selected').attr('startHeight'));
	var width = parseInt($("#addObjectiveFrom").find(':selected').attr('startWidth'));
		var hideOpt = $("#addObjectiveFrom").find(':selected').attr('hideOpt');

	var maxHeight = $("#addObjectiveFrom").find(':selected').attr('maxheight');
	var maxWidth = $("#addObjectiveFrom").find(':selected').attr('maxwidth');
	var lineStartHeight =0;
	var lineEndHeight=0;
	var lineStartWidth=0;
	var lineEndWidth=0;
	var objective = $("#addObjectiveFrom").val();
	var iH = parseInt($("#obFromHeight").val());
	var iW = parseInt($("#obFromWidth").val());
	//console.log(height);
	//console.log(width);
	 var heightOk = false;
	  var widthOk = false;
	
		//console.log(heightName);
		//console.log(widthName);
		//	if (objective == "board")
				{
	
	if ($("#obFromHeight").val() )
	{				if (Math.round(maxHeight/inchHeight) < parseInt($("#obFromHeight").val()))
					{
						$("#obFromHeight").val(Math.round(maxHeight/inchHeight));
					}
			var num = parseInt($("#obFromHeight").val()) * inchHeight;
			if (heightName == "Bottom" || heightName == "bottom edge")
			{
				height = height-num;
				lineEndHeight = height+60;
			//	if (objective == "board")
				{
					lineStartHeight = startHeight;
				}					
						if (objective == "Centre")
				{ 
			lineStartHeight = lineStartHeight-20;
				}
			}
			else
			{
				height = height+num;
				lineEndHeight = height-60;
				//if (objective == "board")
				{
					lineStartHeight = startHeight;
				}
				if (objective == "Centre")
				{ 
			lineStartHeight = lineStartHeight+20;
				}
			}
									//console.log(height);
				//console.log(heightName);
		
				heightOk = true;
				
			
	
			 if (objective == "board")
			{
				console.log("board");
				if (height > 1010 && (heightName == "Top"))
				{
					height = 1000 ;
					$("#obFromHeight").val(boardHeight) ;
					
					heightOk = true;
				}
				if (height < 0 && (heightName == "Top")) 
				{
					height = 0;
					$("#obFromHeight").val(0) ;
					heightOk = true;
				}
							{
				if (height > 1010 && (heightName == "Bottom"))
				{
					height = 1000;
					$("#obFromHeight").val(0) ;
					heightOk = true;
				}
				if (height < 0 && (heightName == "Bottom")) 
				{
					height = 0;
					$("#obFromHeight").val(boardHeight)
					heightOk = true;

				}
				
			}

	}
	}
	if ($("#obFromWidth").val() )
	{
						if (Math.round(maxWidth/inchWidth) <  parseInt($("#obFromWidth").val()) )
					{
						var wotsit = parseInt(Math.round(maxWidth/inchWidth) );
						console.log(wotsit);
						$("#obFromWidth").val(wotsit);
						console.log(wotsit);
					}
			var num = parseInt($("#obFromWidth").val()) * inchWidth;
			if (widthName == "Right" || widthName == "left edge" )
			{
				width = width-num;
				lineEndWidth = width+60;
		//	if (objective == "board")
				{
					lineStartWidth = startWidth;
				}
						if (objective == "Centre")
				{ 
			lineStartWidth = lineStartWidth-20;
				}
			}
			else
			{
				width = width+num;
				lineEndWidth = width-60;
			//	if (objective == "board")
				{
					lineStartWidth = startWidth;
				}
							if (objective == "Centre")
				{ 
			lineStartWidth = lineStartWidth+20;
				}
				
			}
									//console.log(width);
				//console.log(widthName);
	
				widthOk = true;
				
			
			
				if (objective == "board")
			{
			
				if (width > 2010 && (widthName == "Left"))
				{
					width = 2000 ;
					$("#obFromWidth").val(boardWidth) ;
					widthOk = true;
				}
				if (width < 0 && (widthName == "Left")) 
				{
					width = 0;
					$("#obFromWidth").val(0) ;
					widthOk = true;
				}
							{
				if (width > 2010 && (widthName == "Right"))
				{
					width = 2000;
					$("#obFromWidth").val(0) ;
					widthOk = true;
				}
				if (width < 0 && (widthName == "Right")) 
				{
					width = 0;
					$("#obFromWidth").val(boardWidth) 
					widthOk = true;

				}
								
				
			}
	}
	}
				}

console.log(width, height);
	if (widthOk && heightOk)
	{
		recountObs();
		var wdesc = $("#obFromWidth").prev().text();
		var hdesc = $("#obFromHeight").prev().text();
		$("#hiddenOb").replaceWith('<div id="hiddenOb" obId="' + objCount +'" width="'+width+'" height="'+height+'" startheight="'+startHeight+'" startwidth="'+startWidth+'" linestartwidth="'+lineStartWidth+'" lineendwidth="'+lineEndWidth+'" linestartheight="'+lineStartHeight+'" lineendheight="'+lineEndHeight+'"  from="'+objective+'" inchheight="'+iH+'" inchwidth="'+iW+'" hideopt="'+hideOpt+'" wdesc="'+wdesc+'" hdesc="'+hdesc+'"></div>');
		if (obExists)
		{
			$("#hiddenOb").attr("obId", curOb);
		}
		reCreatedepZ(editing,true,"objective");
		$("#saveObContainer").replaceWith('<div id="saveObContainer" class="shower"><button id="saveob" onclick="saveOb(this)" class="btn btn-primary btn-lg btn-block box">Save</button></div>');
		
	}
	else
	{
	$("#saveObContainer").replaceWith('<div id="saveObContainer"></div>');
	}
}
function addCornerLines(e,h,w)
{
///   
//Length, Height
 //   ctx.moveTo(0, 0);
 //   ctx.lineTo(100, 0);
//    ctx.lineTo(0, 100);
 //   ctx.fill();
//40 - arrow
//120 - text	
//console.log(e+h+w);
	if (e != "ignore" && h > 0 && w > 0)
	{

//console.log(e+h+w);

		if (e == "tl")
		{

			if (curDep < 5)
			{
			ctx.fillStyle = "orange";
			ctx.strokeStyle = "orange";

			}
			else
			{
			ctx.fillStyle = "blue";
			ctx.strokeStyle = "blue";
			}
			//ctx.font  = "65px Orbitron, Arial";

			drawLineWithArrows(0, 40,(w*inchWidth)*0.85,40,10,10,false,true);
			ctx.fillText(w +'"' , (w*inchWidth)/1.5 ,120);
			drawLineWithArrows(40, 40,40,((h*inchHeight)-40)*0.9,10,10,false,true);
			ctx.fillText(h +'"' , 120 ,(h*inchHeight)/1.5);
			ctx.fillText('D'+curDep, 160, 160);
		}
		else if (e == "tr")
		{

			if (curDep < 5)
			{
			ctx.fillStyle = "orange";
			ctx.strokeStyle = "orange";

			}
			else
			{
			ctx.fillStyle = "blue";
			ctx.strokeStyle = "blue";
			}
			//ctx.font  = "65px Orbitron, Arial";

			drawLineWithArrows(2000, 40,2000-((w*inchWidth)*0.85),40,10,10,false,true);
			ctx.fillText(w +'"' , 2000- ((w*inchWidth)/1.5) ,120);
			drawLineWithArrows(1960, 40,1960,((h*inchHeight)-40)*0.9,10,10,false,true);
			ctx.fillText(h +'"' , 1880 ,(h*inchHeight)/1.5);
			ctx.fillText('D'+curDep, 1840, 160);
		}
		else if (e == "br")
		{
			var hMath = 1000 - (h*inchHeight);
			//console.log("hmath"+hMath);
			var width = (w*inchWidth);


			if (curDep < 5)
			{
			ctx.fillStyle = "orange";
			ctx.strokeStyle = "orange";

			}
			else
			{
			ctx.fillStyle = "blue";
			ctx.strokeStyle = "blue";
			}
						//ctx.font  = "65px Orbitron, Arial";

			drawLineWithArrows(2000, 960,2000-((w*inchWidth)*0.85),960,10,10,false,true);
			ctx.fillText(w +'"' , 2000- ((w*inchWidth)/1.5) ,940);
			drawLineWithArrows(1960, 960,1960,940-((h*inchHeight)*0.85),10,10,false,true);
			ctx.fillText(h +'"' , 1880 ,980 -((h*inchHeight)/1.5));
			ctx.fillText('D'+curDep, 1840, 900);			
		}
				else if (e == "bl")
		{
			var hMath = 1000 - (h*inchHeight);
			var width = (w*inchWidth);
	
if (curDep < 5)
			{
			ctx.fillStyle = "orange";
			ctx.strokeStyle = "orange";

			}
			else
			{
			ctx.fillStyle = "blue";
			ctx.strokeStyle = "blue";
			}
						//ctx.font  = "65px Orbitron, Arial";

			drawLineWithArrows(0, 960,((w*inchWidth)*0.85),960,10,10,false,true);
			ctx.fillText(w +'"' ,  ((w*inchWidth)/1.5) ,940);
			drawLineWithArrows(40, 960,40,940-((h*inchHeight)*0.80),10,10,false,true);
			ctx.fillText(h +'"' , 120 ,980 -((h*inchHeight)/1.5));
			ctx.fillText('D'+curDep, 160, 900);			
	
			
		}

		//ctx.beginPath();
//ctx.moveTo(2000, 1000);
//ctx.lineTo(2000, 250 );
//ctx.lineTo(-2750, 2000);
//ctx.fill();
	}
	else
	{
		//console.log("notEdgy");
	}

}
function addCorner(e,h,w)
{
///   
//Length, Height
 //   ctx.moveTo(0, 0);
 //   ctx.lineTo(100, 0);
//    ctx.lineTo(0, 100);
 //   ctx.fill();
//40 - arrow
//120 - text	
//console.log(e+h+w);
	if (e != "ignore" && h > 0 && w > 0)
	{

//console.log(e+h+w);

		if (e == "tl")
		{
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(w*inchWidth, 0);
			ctx.lineTo(0, h*inchHeight);			
			ctx.fillStyle = colours[curDep -1];		
			ctx.fill();
		}
		else if (e == "tr")
		{
					ctx.beginPath();
			ctx.moveTo(2000, 0);	
			ctx.lineTo(2000, (h*inchHeight));
			ctx.lineTo(2000-(w*inchWidth), 0);
			ctx.fillStyle = colours[curDep-1];		
			ctx.fill();
			
		}
		else if (e == "br")
		{
					ctx.beginPath();
			var hMath = 1000 - (h*inchHeight);
			//console.log("hmath"+hMath);
			var width = (w*inchWidth);
			ctx.moveTo(2000, 1000);	
			ctx.lineTo(2000, hMath);
			ctx.lineTo(2000 - width , 1000);
			ctx.fillStyle = colours[curDep-1];		
			ctx.fill();	

			
		}
				else if (e == "bl")
		{
			ctx.beginPath();
			var hMath = 1000 - (h*inchHeight);
			var width = (w*inchWidth);
			ctx.moveTo(0, 1000);	
			ctx.lineTo(width , 1000);	
			ctx.lineTo(0, hMath);
			ctx.fillStyle = colours[curDep-1];		
			ctx.fill();
			
		}

		//ctx.beginPath();
//ctx.moveTo(2000, 1000);
//ctx.lineTo(2000, 250 );
//ctx.lineTo(-2750, 2000);
//ctx.fill();
	}
	else
	{
		//console.log("notEdgy");
	}

}


	function getPDF(){

		var HTML_Width = $("#downloadContent").width();
		var HTML_Height = $("#downloadContent").height();
		var top_left_margin = 0;
		var PDF_Width = HTML_Width+(top_left_margin*2);
		var PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
		var canvas_image_width = HTML_Width;
		var canvas_image_height = HTML_Height;
		var pdfName = "40kmission.pdf";
		if ($("#mName").text().length > 0)
		{
			pdfName = $("#mName").text() + ".pdf";
		}
		
		var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
		

		html2canvas($("#downloadContent")[0],{allowTaint:true}).then(function(canvas) {
			canvas.getContext('2d');
			
			console.log(canvas.height+"  "+canvas.width);
			
			
			var imgData = canvas.toDataURL("image/jpeg", 1.0);
			var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
		    pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
			
			
			for (var i = 1; i <= totalPDFPages; i++) { 
				pdf.addPage(PDF_Width, PDF_Height);
				pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
			}
			
		    pdf.save(pdfName);
        });
	};
function checkBoxSizes()
{
	var exBH = parseInt($("#exBoxH").val())|| -1;
	var exBW = parseInt($("#exBoxW").val())|| -1;
	if (exBH < 0)
	{
		exBH = 10;
		$("#exBoxH").val(exBH);
	}
		if (exBW < 0)
	{
		exBW = 15;
		$("#exBoxW").val(exBW);
	}
		if (exBH > boardHeight)
	{
		exBH = boardHeight;
		$("#exBoxH").val(exBH);
	}
		if (exBW > boardWidth)
	{
		exBW = boardWidth;
		$("#exBoxW").val(exBW);
	}
}
function setOffSet(guy){
	if (maxLength > 0)
	{
		
		if (zLength != maxLength)
		{
			var other;
			var spareInches = maxLength - zLength;
			
			console.log(spareInches);
			$( ".offSetCounter" ).each(function() 
			{
				if (!$(this).val())
				{
				$(this).val(0)	
				}
				if (parseInt($(this).val()) < 0)
				{
				$(this).val(0)	
				}
				if ($(this).attr("id") != $(guy).attr("id"))
				{
					other = this;
				}
	
			})
			inchesUsed = (parseInt($(guy).val())) || 0;
			spareInches = spareInches - inchesUsed;
			otherVal  = parseInt($(other).val());
			console.log("inches used: "+inchesUsed + " spare inches: " + spareInches + " other val: " + otherVal);
			//console.log(otherVal);
			if (parseInt($(guy).val()) == 0)
			{
				$(other).val(spareInches);
			}
			
			else if (spareInches < (inchesUsed + otherVal)) //We needto subtract
			{
				
				var toSubtract = difference(spareInches,  otherVal);
				console.log("need to subtract: "+toSubtract);
				var overLoad = false;
				if (toSubtract > otherVal) 
				{					
					//	console.log("maxExceeded: ");
						if ((otherVal - toSubtract) < 1)
						{
							var newGuy = $(guy).val() - (toSubtract-otherVal);
							$(guy).val(newGuy);
						}
						else
						{
							$(guy).val(spareInches-otherVal);
						}
						
						$(other).val(0);
										
				}
				else
				{
					$(other).val(otherVal - toSubtract);
				}
				
			}
			else if (spareInches >= inchesUsed) // We need to Add
			{
				console.log("otherVal = " + otherVal + "adding: " + spareInches);

				$(other).val(spareInches);
							
			}
			
			
		}
			var val = parseInt($("#fromA").val()) ;
			$("#offSetSide").val(val);
			addBox();
		//reCreatedepZ(editing, true,"box");
		
	}
}
//Used to work out if a number is whole or not
function hasDecimal (num) {
	return !!(num % 1);
}
function difference (num1, num2) {
  if (num1 > num2) {
    return num1 - num2
  } else {
    return num2 - num1
  }
}
//applies the image as a preview


function addBox()
{
	cDraw = true;
	dPosition = $("#boardEdge").val();	
	var oL = parseInt($("#offSetEdge").val());
	var zD = parseInt($("#zoneDepth").val());
			if ((dPosition == "t" || dPosition == "b") && ((oL+zD) > boardHeight))
			{
			cDraw = false;

			}
			else if ((dPosition == "r" || dPosition == "l") && ((oL+zD) > boardWidth))
			{
			cDraw = false;

			}
	if (cDraw){
	if ($("#boardEdge").val() != "ignore")
	{	
	//console.log("canDrawstart");

	

	
	$( ".boxChange" ).each(function() 
	{
		
		if($(this).val().length === 0)
		{
			cDraw = false;
		}
	});



console.log(cDraw);
		

	
	if (cDraw)
	{
		
		checkOverlap("box")
		$('#saveDep').show();

		if (dPosition == "t" || dPosition == "b")
		{
		dZoneHeight = ($("#zoneDepth").val() * inchHeight );
		dZoneWidth = ($("#zoneLength").val() * inchWidth);
		dHeight = ($("#offSetEdge").val() * inchHeight);
		dWidth =($("#offSetSide").val() * inchWidth);		
		}
		else
		{
		dZoneWidth = ($("#zoneDepth").val() * inchWidth );
		dZoneHeight = ($("#zoneLength").val() * inchHeight);
		dHeight = 	($("#offSetSide").val() *inchHeight);
		dWidth = ($("#offSetEdge").val() *inchWidth);
		}
		if (dPosition == "b")
		{
			dHeight = ((1000 - dZoneHeight)-dHeight);
		}			
		if (dPosition == "r")
		{
			dWidth = ((2000 - dZoneWidth)-dWidth);
		}		
	if (depZoneId < 9)
	{	//in case they deleted a zone
		 if (editing == false)
		{ 
	recountDeps();
		curDep = depZoneId;
		editing = true;
		}
		$('#hiddenBoxDep').replaceWith('<div id="hiddenBoxDep" zoneid="' + curDep +'" minWidth="'+desStartWidth+'" maxWidth="'+desEndWidth+'" minHeight="'+desStartHeight+'" maxHeight="' +desEndHeight + '" dZoneWidth="' +dZoneWidth + '" dZoneHeight ="'+ dZoneHeight + '" dHeight = "' + dHeight + '" dWidth ="' + dWidth +'" boardEdge="'+dPosition+'"> </div>');	
	 	$('.saveError').hide();
		$('#saveDep').show();
		reCreatedepZ(editing,true, "box");
	}
		else //ran out of colours, also, who needs 9 deployment zones, really...
	{
		$('#saveDep').hide();
		$('.saveError').show();
		$('.saveError').text("You can't have more than 8 deployment zones. You savage.");

	}

		
	}
	else 
	{
	$('#saveDep').hide();

	$('.saveError').show();
	$('.saveError').text("All fields should have a value, even if it's 0");
	}
		
}
	else 
	{
			$('#saveDep').hide();

	$('.saveError').show();
	$('.saveError').text("Select a board edge");
	}
	}
	else
	{
					$('#saveDep').hide();

	$('.saveError').show();
	$('.saveError').text("Zone Depth + offset exceeds board size");
	}
}
function checkExBoxes()
{
	$(".exBoxEdit").each(function(){
	var checker = parseInt($(this).val()) || -1;
	if (checker < 0)
	{
		$(this).val(0)
	}
	});
}

function saveOb(saveButton)
{
	var userOb = $("#hiddenOb");
	var userObId = $(userOb).attr("obId");
	var userWidth =  $(userOb).attr("width");
	var userHeight =  $(userOb).attr("height");
	var userStartHeight =  $(userOb).attr("startheight");
	var userStartWidth =  $(userOb).attr("startwidth");
	var userLineStartWidth =  $(userOb).attr("linestartwidth");
	var userLineStartHeight =  $(userOb).attr("linestartheight");
	var userLineEndWidth=  $(userOb).attr("lineendwidth");
	var userLineEndHeight = $(userOb).attr("lineendheight");
	var userFrom = $(userOb).attr("from");
	var iH = $(userOb).attr("inchheight");
	var iW = $(userOb).attr("inchwidth");
		var hideOpt = $(userOb).attr("hideOpt");
			var wdesc = $(userOb).attr("wdesc");
				var hdesc = $(userOb).attr("hdesc");
		

	


			

		if (!obExists)
	{
		$("#objectiveadd").before	('<div class="hider userItemContainer clearfix" ><div class="delete float-right" onclick="deleteDep(this)">Delete</div><div obId="' + userObId +'" width="'+userWidth+'" height="'+userHeight+'" startheight="'+userStartHeight+'" startwidth="'+userStartWidth+'" linestartwidth="'+userLineStartWidth+'" lineendwidth="'+userLineEndWidth+'" linestartheight="'+userLineStartHeight+'" lineendheight="'+userLineEndHeight+'"  from="'+userFrom+'" inchheight="'+iH+'" inchwidth="'+iW+'" hideopt="'+hideOpt+'" wdesc="'+wdesc+'" hdesc="'+hdesc+'"class="obEdit float-right" onclick="editOb(this)">Objective '+userObId+'</div></div>');
		
		
	}
	else
	{
		$(".obEdit").each(function()
		
		{
			if ($(this).attr("obId") == userObId)
			{
				$(this).parent().replaceWith('<div class="userItemContainer clearfix hider"><div class="delete float-right" onclick="deleteDep(this)">Delete</div><div obId="' + userObId +'" width="'+userWidth+'" height="'+userHeight+'" startheight="'+userStartHeight+'" startwidth="'+userStartWidth+'" linestartwidth="'+userLineStartWidth+'" lineendwidth="'+userLineEndWidth+'" linestartheight="'+userLineStartHeight+'" lineendheight="'+userLineEndHeight+'"  from="'+userFrom+'" inchheight="'+iH+'" inchwidth="'+iW+'" hideopt="'+hideOpt+'" wdesc="'+wdesc+'" hdesc="'+hdesc+'"class="obEdit float-right" onclick="editOb(this)">Objective '+userObId+'</div></div>');
			}
		});
	}
	
	obExists = false;
	depExists = false;
	var isEdit = false;
	reCreatedepZ(isEdit)
	//twtoggle$(".obE").toggle();
	showStuff();
}
function hideStuff(ting)
{
	$(".alwayshide").hide("slow");
	$(".hider").hide("slow");
	$(".hidey").hide("slow");
	
	if ($(ting).attr("shows").length > 0)
	{
		$($(ting).attr("shows")).show("slow");
	}
}
function showStuff()
{
		$(".hidey").show("slow");

	$(".alwayshider").hide("slow");
	$(".hider").show("slow");
}
function editOb(o)
{
	obExists=true;
	curObSH = $(o).attr("inchheight");
	curObSW= $(o).attr("inchwidth");
	curObStartH = $(o).attr("startheight");
	curObStartW= $(o).attr("startwidth");
	curOb = $(o).attr("obid");
	//console.log("edit ob: "+curOb);
	$("#objectiveadd").click();
	
}
function editEx(ex)
{
	editing = true;
	exExists = true;
	existingEx = $(ex).attr("exid");

	if ($(ex).attr("shape") == "circle")
	{
			var exW = parseInt($(ex).attr("w"));
	var exH = parseInt($(ex).attr("h"));
	var rad = parseInt($(ex).attr("radius"));
		$("#exRadius").val(rad);
		$("#circleH").val(exH);
		$("#circleW").val(exW);
		if (exW == (parseInt(boardWidth/2)) && exH == (parseInt(boardHeight/2)) && ($("#circleFromCentre").prop("checked") == false))
		{
			$("#circleFromCentre").click();
		}
		else if ((exW != (parseInt(boardWidth/2)) || exH != (parseInt(boardHeight/2))) && ($("#circleFromCentre").prop("checked") == true))
		{
						$("#circleFromCentre").click();

		}
		
	
	tryCircle();
	$("#exclusionCircleAdd").click();
	}
	else
	{
	var exBoxW = $(ex).attr("exboxw");
	var exBoxH = $(ex).attr("exboxh");
	var exBoxSW = $(ex).attr("exboxsw");
	var exBoxSH =	$(ex).attr("exboxsh");
	$("#exBoxH").val(exBoxH);
	$("#exBoxW").val(exBoxW);
	$("#exBoxSH").val(exBoxSH);
	$("#exBoxSW").val(exBoxSW);
	if (((boardWidth/2)-(parseInt($("#exBoxW").val())/2)) == parseInt(exBoxW ) && ((boardHeight/2)-(parseInt($("#exBoxH").val())/2)) == exBoxH &&  ($("#boxfromCentre").prop("checked") == false))
	{
		$("#boxfromCentre").click();
	}
	else if (((boardWidth/2)-(parseInt($("#exBoxW").val())/2)) != parseInt(exBoxW ) && ((boardHeight/2)-(parseInt($("#exBoxH").val())/2)) != exBoxH &&  ($("#boxfromCentre").prop("checked") == true))
			{
		$("#boxfromCentre").click();
	}
	$("#exclusionBoxAdd").click();
	}
	
}

function saveEx(saveButton)
{
	var exid = $("#hiddenEx").attr("exid");

			var shape = $("#hiddenEx").attr("shape");
	if (!exExists)
	{
		if (shape == "circle")
		{
		var w= $("#hiddenEx").attr("w");
		var h= $("#hiddenEx").attr("h");
		var radius= $("#hiddenEx").attr("radius");
		$("#exclusionBoxAdd").before('<div class="hider userItemContainer" class="clearfix"><div class="delete float-right" onclick="deleteDep(this)">Delete</div><div shape="'+shape+'" radius="'+radius+'" h="'+h+'" w="'+w+'" exid="'+exid+'" class="exEdit float-right" onclick="editEx(this)">Exclusion Zone '+exid+'</div></div>');
		}
		else
		{
	var exBoxW = $("#hiddenEx").attr("exboxw");
	var exBoxH = $("#hiddenEx").attr("exboxh");
	var exBoxSW = $("#hiddenEx").attr("exboxsw");
	var exBoxSH =	$("#hiddenEx").attr("exboxsh");
		$("#exclusionBoxAdd").before('<div class="hider userItemContainer" class="clearfix"><div class="delete float-right" onclick="deleteDep(this)">Delete</div><div shape="'+shape+'" exboxsh="'+exBoxSH+'" exboxsw="'+exBoxSW+'" exboxh="'+exBoxH+'" exBoxW="'+exBoxW+'" exid="'+exid+'" class="exEdit float-right" onclick="editEx(this)">Exclusion Zone '+exid+'</div></div>');
		}
	}
	else
	{
		$(".exEdit").each(function(){
			if (parseInt($(this).attr("exid")) == parseInt(existingEx))
			{
				if (shape == "circle")
				{
				var w= $("#hiddenEx").attr("w");
				var h= $("#hiddenEx").attr("h");
				var radius= $("#hiddenEx").attr("radius");
				$(this).parent().replaceWith('<div class="hider userItemContainer" class="clearfix"><div class="delete float-right" onclick="deleteDep(this)">Delete</div><div shape="'+shape+'" radius="'+radius+'" h="'+h+'" w="'+w+'" exid="'+exid+'" class="exEdit float-right" onclick="editEx(this)">Exclusion Zone '+exid+'</div></div>');
				}
				else
				{
						var exBoxW = $("#hiddenEx").attr("exnoxw");
	var exBoxH = $("#hiddenEx").attr("exboxh");
	var exBoxSW = $("#hiddenEx").attr("exboxsw");
	var exBoxSH =	$("#hiddenEx").attr("exboxsh");
		$(this).parent().replaceWith('<div class="hider userItemContainer" class="clearfix"><div class="delete float-right" onclick="deleteDep(this)">Delete</div><div shape="'+shape+'" exboxsh="'+exBoxSH+'" exboxsw="'+exBoxSW+'" exboxh="'+exBoxH+'" exBoxW="'+exBoxW+'" exid="'+exid+'" class="exEdit float-right" onclick="editEx(this)">Exclusion Zone '+exid+'</div></div>');
				}
			}
		});
	}
	reCreatedepZ(false)

	exExists = false;
	
}
function saveDep(saveButton) 
{
	$('#saveDep').hide();
	
	var cId = $("#hiddenCornerDep").attr("zoneid");
	var bId = $("#hiddenBoxDep").attr("zoneid");

	if (!depExists)
	{
		if($(saveButton).hasClass("box"))
		{
	$('#addDep').before('<div class="userItemContainer hider" class="clearfix"><div class="delete float-right" onclick="deleteDep(this)">Delete</div><div zoneid="' + bId +'" minWidth="'+desStartWidth+'" maxWidth="'+desEndWidth+'" minHeight="'+desStartHeight+'" maxHeight="' +desEndHeight + '" dZoneWidth="' +dZoneWidth + '" dZoneHeight ="'+ dZoneHeight + '" dHeight = "' + dHeight + '" dWidth ="' + dWidth +'" boardEdge="'+dPosition+'" class="depToggle hider depZ depEdit box float-right" onclick="editDep(this)">Deployment Zone ' +curDep +'</div></div>');		;
		}
		else
		{
			$('#addDep').before('<div class="userItemContainer hider" class="clearfix"><div class="delete float-right" onclick="deleteDep(this)">Delete</div><div class="hider depToggle depZ depEdit float-right corner" zoneid="' + cId +'" corneredge="'+cEdge+'" cornerheight="'+cHeight+'" cornerwidth = "'+cWidth+'" onclick="editDep(this)">Deployment Zone ' +curDep +' </div></div>');
		}
	}

	else 
	{
if($(saveButton).hasClass("box"))
		{
	$( ".depZ" ).each(function() 
	{
		
		if ($(this).attr("zoneid") == curDep)
	{
	$(this).parent().replaceWith('<div class="userItemContainer hider" class="clearfix"><div class="delete float-right">Delete</div><div zoneid="' + bId +'" minWidth="'+desStartWidth+'" maxWidth="'+desEndWidth+'" minHeight="'+desStartHeight+'" maxHeight="' +desEndHeight + '" dZoneWidth="' +dZoneWidth + '" dZoneHeight ="'+ dZoneHeight + '" dHeight = "' + dHeight + '" dWidth ="' + dWidth +'" boardEdge="'+dPosition+'" class="depToggle  depZ depEdit box float-right" onclick="editDep(this)">Deployment Zone ' +curDep + '</div></div>');		
					}
	}
		)}
		else
		{
			$( ".depZ" ).each(function() 
	{
		
		if ($(this).attr("zoneid") == curDep)
	{
$(this).parent().replaceWith('<div class="userItemContainer hider" class="clearfix"><div class="delete float-right" onclick="deleteDep(this)">Delete</div><div class="depToggle depZ depEdit float-right corner" zoneid="' + cId +'" corneredge="'+cEdge+'" cornerheight="'+cHeight+'" cornerwidth = "'+cWidth+'" onclick="editDep(this)">Deployment Zone ' +curDep +' </div></div>');
					}
	});
			
			
		}
		
	

		//updating existing

	}
	depExists = false;
	var isEdit = false;
	reCreatedepZ(isEdit)

}

//rebuilds all shapes,
//isEdit = bool -  updates the editing field (probably not the correct place for this),
//hasChange = bool - if True after rebuilding Existing shapes will then add the new temporary shape
//changeShape = string - box, corner, ob  
function reCreatedepZ(isEdit, hasChange, changeShape)
{
	console.log("boop");
	if (isEdit == true && editing == false)
	{
		editing = true;

	}
	else if (isEdit == false && editing == true)

	{
		editing = false;

	}
			
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		$( ".depZ" ).each(function() 
			{								
			if($(this).hasClass("box"))
			{
							if (depExists  && ($("#hiddenBoxDep").attr("zoneid") == $(this).attr("zoneid")))
				{
					//console.log("skup");
				}
				else{
			addDBox($(this));
				}
			}
			else
			{
				//console.log("corner");
				if (depExists  && ($("#hiddenCornerDep").attr("zoneid") == $(this).attr("zoneid")))
				{
					//console.log("skup");
				}
				else
				{

				
					
					curDep = ($(this)).attr("zoneid");
					
					
				//console.log("adding existing corner with zoneId of " + curDep);

					//console.log("adding corner with zone of: " + curDep);
					var cE = $(this).attr("corneredge");
					var cH = $(this).attr("cornerheight");
					var cW = $(this).attr("cornerwidth");
					addCorner(cE,cH,cW);
				}
					
			}
		
			});
			


			
			if (hasChange == true)
			{
				if (changeShape == "box")
				{
					
					addDBox("#hiddenBoxDep");
				}
				if (changeShape == "corner")
				{
					curDep = $("#hiddenCornerDep").attr("zoneid");
					//console.log("adding preview corner with zoneId of " + curDep);

					var cE = $("#hiddenCornerDep").attr("corneredge");
					var cH = $("#hiddenCornerDep").attr("cornerheight");
					var cW = $("#hiddenCornerDep").attr("cornerwidth");
					addCorner(cE,cH,cW);
				}
	
				
			}
			
						$( ".depZ" ).each(function() 
			{	
			
			if($(this).hasClass("box"))
			{
			if (depExists  && ($("#hiddenBoxDep").attr("zoneid") == $(this).attr("zoneid")))
				{
					//console.log("skup");
				}
				else{
			addDBoxLines($(this));
				}
			} 
			else
			{
				//console.log("corner");
				if (depExists  && ($("#hiddenCornerDep").attr("zoneid") == $(this).attr("zoneid")))
				{
					//console.log("skup");
				}
				else
				{

				
					
					curDep = ($(this)).attr("zoneid");
					
					
				//console.log("adding existing corner with zoneId of " + curDep);

					//console.log("adding corner with zone of: " + curDep);
					var cE = $(this).attr("corneredge");
					var cH = $(this).attr("cornerheight");
					var cW = $(this).attr("cornerwidth");
					addCornerLines(cE,cH,cW);
				}
					
			}
		
			});
						centreReq = false;

					if (hasChange == true)
			{
				if (changeShape == "box")
				{
					
					addDBoxLines("#hiddenBoxDep");
				}
				if (changeShape == "corner")
				{
					curDep = $("#hiddenCornerDep").attr("zoneid");
					//console.log("adding preview corner with zoneId of " + curDep);

					var cE = $("#hiddenCornerDep").attr("corneredge");
					var cH = $("#hiddenCornerDep").attr("cornerheight");
					var cW = $("#hiddenCornerDep").attr("cornerwidth");
					addCornerLines(cE,cH,cW);
				}
					if (changeShape == "objective")
				{
					if ($("#hiddenOb").attr("from") == "Centre")
					{
						centreReq = true;
					}
					addO("#hiddenOb");
				}
		
				//if (changeShape == "cirle")
					else if (changeShape == "circle")
				{
									

									console.log(changeShape);

					addExclusion("circle", "#hiddenEx");
				}
									else if (changeShape == "exbox")
				{

									console.log(changeShape);

					addExclusion("exbox", "#hiddenEx");
				}
			}
			$(".exEdit").each(function()
			{
					if (exExists && $("#hiddenEx").attr("exid") == $(this).attr("exid"))
				{
					//console.log("found");
				}
				else if ($(this).attr("shape") == "circle")
				{
					addExclusion("circle", $(this));
				}
				else
				{
										addExclusion("exbox", $(this));

				}
				
			});
			$(".obEdit").each(function()
			{
				//console.log("hiddenObId: "+ $("#hiddenOb").attr("obId") );
				//console.log("ObId: "+ $($(this)).attr("obId") );

				if (obExists && $("#hiddenOb").attr("obId") == $(this).attr("obId"))
				{
					//console.log("found");
				}
				else 
				{
						if ($(this).attr("from") == "Centre")
					{
						centreReq = true;
					}
				addO($(this));
				}
			});
			if (centreReq)
			{
				ctx.fillStyle = "purple";
				ctx.strokeStyle= "purple";
				ctx.beginPath();
ctx.arc(1000, 500, 10, 0, 2 * Math.PI);
ctx.stroke();
ctx.fill();
	ctx.fillStyle = "white";
				ctx.strokeStyle= "white";
			}
			describify();
}
function addExclusion(shape, ex)
{
	ctx.fillStyle = "#339a8d";
	ctx.strokeStyle= "#339a8d";
	if (shape == "exbox")
	{
		var exboxsh = parseInt($(ex).attr("exboxsh"))*inchHeight;
		var exboxsw = parseInt($(ex).attr("exboxsw"))*inchWidth;
			var exboxh = parseInt($(ex).attr("exboxh"))*inchHeight;
		var exboxw = parseInt($(ex).attr("exboxw"))*inchWidth;
			ctx.fillRect(exboxsw,exboxsh, exboxw, exboxh);	
		ctx.fillStyle = "white";
		ctx.strokeStyle= "white";
		drawLineWithArrows(exboxsw +20, exboxh+exboxsh ,exboxsw +20, (exboxsh),10,10,false,true);
			drawLineWithArrows(exboxsw +exboxw, exboxh+exboxsh-20 ,exboxsw+25, (exboxh+exboxsh-20),10,10,true,false);

		ctx.fillText($(ex).attr("exboxh") +'"' , exboxsw+((($(ex).attr("exboxh").length)+1)*29),
		exboxsh+55);
		ctx.fillText($(ex).attr("exboxw") +'"' , (exboxsw+exboxw-((($(ex).attr("exboxw").length)+1)*22)),
		exboxh+exboxsh-45);

					
	}
	else if (shape == "circle")
	{
	
		
		ctx.beginPath();
		ctx.arc($(ex).attr("w")*inchWidth, $(ex).attr("h")*inchHeight, $(ex).attr("radius")*(inchHeight), 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.strokeStyle= "white";
		drawLineWithArrows($(ex).attr("w")*inchWidth, $(ex).attr("h")*inchHeight,$(ex).attr("w")*inchWidth, ($(ex).attr("h")-$(ex).attr("radius"))*inchHeight,10,10,false,true);
			ctx.fillStyle = "#339a8d";
		ctx.strokeStyle= "#339a8d";
		ctx.beginPath();
		ctx.arc($(ex).attr("w")*inchWidth, $(ex).attr("h")*inchHeight, 50, 0, 2 * Math.PI);
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.strokeStyle= "white";
		ctx.fillText($(ex).attr("radius") +'"' , $(ex).attr("w")*inchWidth, parseInt($(ex).attr("h")*inchHeight)+25);
		
	}
}
function describify()
{
	$("#deploymentSetup").empty();
	$("#objectiveSetup").empty();
var obdesc = '<div class="itemdescriber card text-white bg-secondary mb-3"><div class=" card-title">Objective Setup</div><div class="card-body"><ul>';
$(".obEdit").each(function()
{
	obdesc = obdesc +'<li><span class = "itemdescribername">'+ $(this).text()+ '</span>';
	var wdesc = $(this).attr("wdesc");
	var hdesc = $(this).attr("hdesc");
	
	if ($(this).attr("hideopt") != "w")
	{
		obdesc = obdesc + " is placed "+$(this).attr("inchwidth")+" inches "+wdesc.toLowerCase();
	}
	if ($(this).attr("hideopt") != "w" && $(this).attr("hideopt") != "h" )
	{
		obdesc = obdesc +" and "+$(this).attr("inchheight")+" inches "+hdesc.toLowerCase()+".</li>";
	}
	else if ($(this).attr("hideopt") == "w" && $(this).attr("hideopt") != "h" )
	{
				obdesc = obdesc + " is placed "+$(this).attr("inchheight")+" inches "+hdesc.toLowerCase()+".</li>";

	}
	else
	{
		obdesc = obdesc + ".</li>";
	}

	
});
obdesc = obdesc +"</ul></div></div>"
$("#objectiveSetup").append( obdesc );

var desc = '<div class="itemdescriber card text-white bg-secondary mb-3"><div class=" card-title">Deployment Setup</div><div class="card-body"><ul>';

$(".depZ").each(function()
{

if ($(this).hasClass('box'))
{
var minW = parseInt($(this).attr("minwidth"));
var maxW =  parseInt($(this).attr("maxwidth"));
var minH =  parseInt($(this).attr("minheight"));
var maxH =  parseInt($(this).attr("maxheight"));
var maxHI = Math.round(maxH/inchHeight);
var minHI = Math.round(minH/inchHeight);
var maxWI = Math.round(maxW/inchWidth);
var minWI = Math.round(minW/inchWidth);
var wI = maxWI-minWI;
var hI = maxHI-minHI;
var bE =  $(this).attr("boardedge");
var isH = false;
if (bE == "t")
{
	bE = "top";
}
else if (bE == "b")
{
	bE = "bottom";
}
else if (bE == "l")
{
	bE = "left";
}
else if (bE == "r")
{
	bE = "right";
}
if ((minW == 0 && maxW == 2000) || (minH == 0 && maxH == 1000))
{
	desc = desc +'<li><span class = "itemdescribername">'+ $(this).text()+ '</span>' + " starts at the "+bE+" of the board and spans the full length";

	
}


else if (bE == "left" || bE == "right")
{
	if (maxHI == boardHeight)
	{
		desc = desc + '<li><span class = "itemdescribername">'+ $(this).text()+ '</span>'  + " starts on the bottom "+bE+ " of the board and spans "+hI+" inches";
	}
	else  if (parseInt(minHI) == 0)
	{
		desc = desc + '<li><span class = "itemdescribername">'+ $(this).text()+ '</span>'  + " starts on the top "+bE+ " of the board and spans "+hI+" inches";
	}
	else if ((boardHeight-maxHI) < minHI)
	{
			desc = desc + '<li><span class = "itemdescribername">'+ $(this).text()+ '</span>'   +" starts on the "+ bE + " of the board "+(boardHeight-maxHI) +" inches from the bottom and spans "+hI+" inches";
	}
	else
	{
			desc = desc + '<li><span class = "itemdescribername">'+ $(this).text()+ '</span>'  + " starts on the "+bE+" of the board, "+ (minHI) +" inches from the top  and spans "+hI+" inches";
	}
		
	}
else if (bE == "top" || bE == "bottom")
	{
if (maxWI == boardWidth)
	{
		desc = desc + '<li><span class = "itemdescribername">'+ $(this).text()+ '</span>'  + " starts on the "+bE+ " right of the board and spans "+wI+" inches";
	}
	else  if (parseInt(minWI) == 0)
	{
		desc = desc + '<li><span class = "itemdescribername">'+ $(this).text()+ '</span>'  + " starts on the "+bE+ " left of the board and spans "+wI+" inches";
	}
	else if ((boardWidth-maxWI) < minWI)
	{
			desc = desc + '<li><span class = "itemdescribername">'+ $(this).text()+ '</span>'   +" starts on the " +bE+" of the board "+ (boardWidth-maxWI) +" inches from the right and spans "+wI+" inches";
	}
	else
	{
			desc = desc + '<li><span class = "itemdescribername">'+ $(this).text()+ '</span>'  + " starts on the "+bE+" of the board "+ (minWI) +" inches from the left and spans "+wI+" inches";
	}
	}

 if (bE == "top" || bE == "bottom")
	{
		desc = desc + " with a depth of " + hI + " inches.";
		if (bE == "top" && minHI != 0)
		{
			desc = desc + "This deployment zone starts "+minHI+" inches from it's starting board edge."
		}
		else if (bE == "bottom" && maxHI != boardHeight)
		{
			desc = desc + "This deployment zone starts "+(boardHeight-maxHI)+" inches from it's starting board edge."
		}
		
	}
	else 
		if (bE == "left" || bE == "right")
	{
		desc = desc + " with a depth of " + wI + " inches.";
				if (bE == "left" && minWI != 0)
		{
			desc = desc + "This deployment zone starts "+minWI+" inches from it's starting board edge."
		}
		else if (bE == "right" && maxWI != boardWidth)
		{
			desc = desc + "This deployment zone starts "+(boardWidth-maxWI)+" inches from it's starting board edge."
		}

	}

}
else if ($(this).hasClass('corner'))
{
	var ce = $(this).attr("corneredge");
	if (ce == "tl")
	{
		ce = "top left";
	}
	else if (ce == "tr")
	{
		ce = "top right";
	}
	else if (ce == "bl")
	{
		ce = "bottom left";
	}
	else if (ce == "br")
	{
		ce = "bottom right";
	}
	
desc = desc + '<li><span class = "itemdescribername">'+ $(this).text()+ '</span>'  + " is a diagonal deployment zone starting in the "+ce+" corner, and is all space from this corner between "+$(this).attr("cornerheight")+ " inches in height and "+$(this).attr("cornerwidth")+" inches in width.";
}

desc = desc +"</li>";

});

desc = desc + "</ul>"
if ($(".exEdit").length > 0){
	 desc = desc + '<span class="itemdescribername">The following areas are excluded from the deployment zones stated above</span><ul>'
		var cHeight = boardHeight/2;
		var cWidth = boardWidth/2;
		$(".exEdit").each(function()
{
if ($(this).attr("shape") == "circle")
{ 
	if (parseInt($(this).attr("h")) == cHeight && parseInt($(this).attr("w")) == cWidth )
	{
		desc = desc + "<li>From the centre of the board, draw a circle with a radius of "+$(this).attr("radius") + "inches.</li>";
	}
	else 
	{
	desc = desc+ "<li>Starting "+ $(this).attr("w") +" inches across from the left of the board and " + $(this).attr("h") + " inches down from the top of the board, draw a circle with a radius of " + $(this).attr("radius") + " inches.</li>";
	}
}
else {
		desc = desc+ "<li>Starting "+ $(this).attr("exboxsw") +" inches across from the left of the board and " + $(this).attr("exboxsh") + " inches down from the top of the board, draw a box with a width (going right) of " + $(this).attr("exboxw") + " inches and a height (moving down) of "+$(this).attr("exboxh")+ " inches.</li>";
	
}

});
desc = desc + "</ul>"
}

desc = desc +"</div></div>";
		$("#deploymentSetup").append(desc);

}


function addO(o)
{
	
ctx.fillStyle = "white";
ctx.strokeStyle = "white";
var from = $(o).attr("from");
var oheight = parseInt($(o).attr("height"));
//ctx.font  = "65px Orbitron, Arial";
	
var owidth = parseInt($(o).attr("width"));
var ostartwidth = parseInt($(o).attr("startwidth"));
var ostartheight = parseInt($(o).attr("startheight"));

var olinestartwidth = parseInt($(o).attr("linestartwidth"));
var olinestartheight = parseInt($(o).attr("linestartheight"));

var olineendwidth = parseInt($(o).attr("lineendwidth"));
var olineendheight = parseInt($(o).attr("lineendheight"));
var hideOpt = $(o).attr("hideopt");
var ob = $(o).attr("obId");
ctx.beginPath();
ctx.arc(owidth, oheight, 50, 0, 2 * Math.PI);
ctx.stroke();
ctx.fill();
	ctx.fillStyle = "black";
ctx.fillText(ob, owidth, parseInt(oheight+20));
	ctx.fillStyle = "white";

var heightCompare;
var widthCompare;

heightCompare = difference(oheight,ostartheight);
widthCompare = difference(owidth,ostartwidth);
lineWidthCompare = difference(olinestartwidth,olineendwidth);
lineHeightCompare = difference(olinestartheight,olineendheight);
console.log($(o).attr("from"));
console.log($(o).attr("from").startsWith("Objective"));
	if (hideOpt != "w")
{

	//console.log("width wcompare "+widthCompare+" hcompare "+heightCompare);
		var dist = Math.round((widthCompare)/inchWidth);
		var textloc = olinestartwidth;
		if (olinestartwidth < olineendwidth)//from the right
		{
			textloc = textloc + (lineWidthCompare/2)
		}
		else
		{
			textloc = textloc - (lineWidthCompare/2)
		}
		ctx.fillText(dist +'"' , textloc,oheight+67);
	
	drawLineWithArrows(olinestartwidth, oheight,olineendwidth,oheight,10,10,true,true);
}
	if (hideOpt != "h")
{
		var textloc = olinestartheight;
		if (olinestartheight < olineendheight)//from the right
		{
			textloc = textloc + (lineHeightCompare/2)
		}
		else
		{
			textloc = textloc - (lineHeightCompare/2)
		}
		//console.log("height wcompare "+widthCompare+" hcompare "+heightCompare);
		dist = Math.round((heightCompare)/inchHeight);
		ctx.fillText(dist +'"' ,owidth+90,  textloc);
		drawLineWithArrows(owidth, olinestartheight,owidth,olineendheight,10,10,true,true);
		

}
}
function setFromTo(guy)
{
	var ob = $("#addObjectiveFrom");
	var obFrom =  $("#addObjectiveFrom").val();
	var heightName = $(guy).find(':selected').attr('dheightName');
	var widthName = $(guy).find(':selected').attr('dwidthName');
	var heightLabelText = "From the "+heightName+" of "+ obFrom;
	var wValue;
	var hValue;
	var widthLabelText = "From the "+widthName+" of "+ obFrom;
	var hideOpt =  $(guy).find(':selected').attr('hideopt');
	
				//console.log(obExists, curObSW);
		 wValue=  parseInt($("#obFromWidth").val()) || 4;
				 hValue = parseInt($("#obFromHeight").val()) || 4;
			
	//console.log(obFrom);
		//if (obFrom != "ignore")
		{
				$("#obFromTo").show();

		//	if (obFrom == "board")
			{


				
				if (obExists)
				{
					wValue = curObSW;
					hValue = curObSH;
				}
				$("#obFromTo").replaceWith('<div id="obFromTo"></div>');
				$("#obFromTo").prepend('<input type="number" id="obFromHeight" class="form-control fromToSet" value="'+hValue+'" onchange="trySetOb()">');
				$("#obFromTo").prepend('<label for "obFromHeight">' + heightLabelText + ' </label>');
				$("#obFromTo").prepend('<input type="number" id="obFromWidth" class="form-control fromToSet"  value="'+wValue+'" onchange="trySetOb()">');
				$("#obFromTo").prepend('<label for "obFromWidth">' + widthLabelText + ' </label>'); 
				if (hideOpt == "h")
				{
					$("#obFromHeight").prev().hide();
					$("#obFromHeight").val(0);

					$("#obFromHeight").hide();

					
				}
								if (hideOpt == "w")
				{
					$("#obFromWidth").prev().hide();
					$("#obFromWidth").val(0);

					$("#obFromWidth").hide();

					
				}
				trySetOb();
 
			}
		}
		
}
function addDBox(dZoneDraw)
{
	dZoneWidth = ($(dZoneDraw).attr("dZoneWidth"));	
			dZoneHeight = ($(dZoneDraw).attr("dZoneHeight"));	
			dHeight = ($(dZoneDraw).attr("dHeight"));	
			dWidth = ($(dZoneDraw).attr("dWidth"));
			dPosition = ($(dZoneDraw).attr("boardEdge"));	
			curDep = $(dZoneDraw).attr("zoneid")
			////console.log(colours[curDep]);
			ctx.fillStyle = colours[curDep-1];
			//ctx.font  = "65px Orbitron, Arial";
			ctx.fillRect(dWidth,dHeight, dZoneWidth, dZoneHeight);		
			ctx.save();
			
}

function tryExBox()
{
	var exBoxW = parseInt($("#exBoxW").val());
	var exBoxH = parseInt($("#exBoxH").val());
	var exBoxSW = parseInt($("#exBoxSW").val());
	var exBoxSH = parseInt($("#exBoxSH").val());
	recountExs();
	$("#hiddenEx").replaceWith('<div id="hiddenEx" shape="exbox" exboxsh="'+exBoxSH+'" exboxsw="'+exBoxSW+'" exboxh="'+exBoxH+'" exBoxW="'+exBoxW+'" exId="'+curEx+'"></div>');
		if (exExists)
		{
			$("#hiddenEx").attr("exId",existingEx);
		}
		reCreatedepZ(true,true,"exbox");
}
function tryCircle()
{
	var eDraw = true;
			$(".exC").each(function(){
				var numberwang = parseInt($(this).val()) || -1;
				if (numberwang < 0)
				{
					eDraw = false;
					console.log(numberwang);
					console.log($(this).attr("id"));
					
				}
				

	});
	
console.log(eDraw);
	
				if (eDraw)
				{
							recountExs();

						var radius = parseInt($("#exRadius").val()) || -1;
						var cH = parseInt($("#circleH").val()) || -1;
						var cW = parseInt($("#circleW").val()) || -1;
						console.log(radius +","+cH+","+cW);
						if (radius >= 0 && cH >= 0 && cW >= 0)
						{
						
						$("#hiddenEx").replaceWith('<div id="hiddenEx" shape="circle" radius="'+radius+'" h="'+cH+'" w="'+cW+'" exId="'+curEx+'"></div>');
						if (exExists)
						{
							$("#hiddenEx").attr("exId",existingEx);
						}
						reCreatedepZ(true,true,"circle");
						}
						
				}

}
function addDBoxLines(dZoneDraw)
{
	dZoneWidth = ($(dZoneDraw).attr("dZoneWidth"));	
			dZoneHeight = ($(dZoneDraw).attr("dZoneHeight"));	
			dHeight = ($(dZoneDraw).attr("dHeight"));	
			dWidth = ($(dZoneDraw).attr("dWidth"));
			dPosition = ($(dZoneDraw).attr("boardEdge"));	
			curDep = $(dZoneDraw).attr("zoneid")
			////console.log(colours[curDep]);
			ctx.fillStyle = colours[curDep-1];
			//ctx.font  = "65px Orbitron, Arial";
			//ctx.fillRect(dWidth,dHeight, dZoneWidth, dZoneHeight);		
			ctx.save();
			
			//change colour of inner text to stand out against the deployment Zone
			if (curDep < 5)
			{
			ctx.fillStyle = "orange";
			ctx.strokeStyle = "orange";

			}
			else
			{
			ctx.fillStyle = "blue";
			ctx.strokeStyle = "blue";
			}

			var midHeight;
			var midWidth;
			var inchStart;
			//Display the Deployment Zone Name
			if (dPosition == "t")
			{
			
			midHeight = (parseInt($(dZoneDraw).attr("maxHeight"))+ parseInt($(dZoneDraw).attr("minHeight"))) /2;	
			midWidth = (parseInt($(dZoneDraw).attr("maxWidth")) + parseInt($(dZoneDraw).attr("minWidth"))) /2;	
			ctx.fillText('D'+curDep, midWidth+65, midHeight);
			ctx.save();
			}
			else if (dPosition == "l")
			{
			
			midHeight = (parseInt($(dZoneDraw).attr("maxHeight"))+ parseInt($(dZoneDraw).attr("minHeight"))) /2;	
			midWidth = (parseInt($(dZoneDraw).attr("maxWidth")) + parseInt($(dZoneDraw).attr("minWidth"))) /2;	
			ctx.fillText('D'+curDep, midWidth, parseInt($(dZoneDraw).attr("maxHeight"))-40);
			ctx.save();
			}
			else if (dPosition == "r")
			{
			midHeight = ((parseInt($(dZoneDraw).attr("maxheight")) -  parseInt($(dZoneDraw).attr("minheight")))/2)+ parseInt($(dZoneDraw).attr("minheight"));	
			midWidth = ((parseInt($(dZoneDraw).attr("maxwidth")) -  parseInt($(dZoneDraw).attr("minwidth")))/2)+ parseInt($(dZoneDraw).attr("minwidth"));		
			ctx.fillText('D'+curDep, midWidth, parseInt($(dZoneDraw).attr("maxHeight"))-40);
			ctx.save();
			}
			else if (dPosition == "b")
			{
			midHeight = ((parseInt($(dZoneDraw).attr("maxheight")) -  parseInt($(dZoneDraw).attr("minheight")))/2)+ parseInt($(dZoneDraw).attr("minheight"));	
			midWidth = ((parseInt($(dZoneDraw).attr("maxwidth")) -  parseInt($(dZoneDraw).attr("minwidth")))/2)+ parseInt($(dZoneDraw).attr("minwidth"));		
			ctx.fillText('D'+curDep, midWidth+65, midHeight);
			ctx.save();
			}
			//show the deployment ZoneDepth with an arror
			if (dPosition == "t")
			{
				ctx.lineWidth = 7;
				var widthLocation = midWidth; //500px away from the deployment 
				var startLocation = ($(dZoneDraw).attr("minHeight"));
				var endLocation = ($(dZoneDraw).attr("maxHeight"));
				drawLineWithArrows(widthLocation,startLocation,widthLocation,endLocation,10,10,true,true);
				//ctx.font  = "65px Orbitron, Arial";
				var textLocation = widthLocation-90;
				ctx.fillText(Math.round(((midHeight -startLocation) *2)/inchHeight) +'"' , textLocation, midHeight);		
				inchStart = (Math.round(startLocation/inchHeight));
				if (inchStart > 0)
				{
					oldColour = (ctx.strokeStyle);
					ctx.strokeStyle = "orange";
					ctx.fillStyle = "orange";
					
					drawLineWithArrows(widthLocation,0,widthLocation,startLocation,10,10,true);
					
					ctx.fillText(inchStart +'"' , textLocation, startLocation);
					ctx.strokeStyle = oldColour;
					ctx.fillStyle = oldColour;

					
				}
			}	
		else if (dPosition == "b")
			{
				ctx.lineWidth = 7;
				var widthLocation = midWidth; //500px away from the deployment 
				var startLocation = ($(dZoneDraw).attr("minheight"));
				var endLocation = ($(dZoneDraw).attr("maxheight"));
				
				drawLineWithArrows(widthLocation,startLocation,widthLocation,endLocation,10,10,true,true);
				//ctx.font  = "65px Orbitron, Arial";
				var textLocation = widthLocation-90;	
				ctx.fillText(Math.round((endLocation - startLocation)/inchHeight) +'"' , textLocation, midHeight);

				inchStart = (Math.round((1000-endLocation)/inchHeight));
				if (inchStart > 0)
				{
					oldColour = (ctx.strokeStyle);
					ctx.strokeStyle = "orange";
					ctx.fillStyle = "orange";
					
					drawLineWithArrows(widthLocation,endLocation,widthLocation,1000,10,10,true,false);
					
					ctx.fillText(inchStart +'"' , textLocation, 1000);
					ctx.strokeStyle = oldColour;
					ctx.fillStyle = oldColour;

					
				}
			}				
			else if (dPosition == "l")
			{
				ctx.lineWidth = 7;
		
				var heightLocation = parseInt($(dZoneDraw).attr("maxHeight"))-100; //500px away from the deployment 
				var startLocation = ($(dZoneDraw).attr("minWidth"));
				var endLocation = ($(dZoneDraw).attr("maxWidth"));
				drawLineWithArrows(startLocation,heightLocation,endLocation,heightLocation,10,10,true,true);
				//ctx.font  = "65px Orbitron, Arial";
				var textLocation = heightLocation-25;
				ctx.fillText(Math.round((endLocation - startLocation)/inchWidth) +'"' , midWidth, textLocation);	
				inchStart = (Math.round(startLocation/inchWidth));
				if (inchStart > 0)
				{
					oldColour = (ctx.strokeStyle);
					ctx.strokeStyle = "orange";
					ctx.fillStyle = "orange";
					
					drawLineWithArrows(0,heightLocation,startLocation,heightLocation,10,10,false,true);
					
					ctx.fillText(inchStart +'"' , (startLocation *0.5), textLocation);
					ctx.strokeStyle = oldColour;
					ctx.fillStyle = oldColour;

					
				}
			
			}			
			else if (dPosition == "r")
			{
				ctx.lineWidth = 7;
				var heightLocation = parseInt($(dZoneDraw).attr("maxHeight"))-100; //500px away from the deployment 
				var startLocation = ($(dZoneDraw).attr("minWidth"));
				var endLocation = ($(dZoneDraw).attr("maxWidth"));
				drawLineWithArrows(startLocation,heightLocation,endLocation,heightLocation,10,10,true,true);
				//ctx.font  = "65px Orbitron, Arial";
				var textLocation = heightLocation-25;
				ctx.fillText(Math.round((endLocation-startLocation)/inchWidth) +'"' , midWidth, textLocation);	
				inchStart = (Math.round((2000-endLocation)/inchWidth));
				if (inchStart > 0)
				{
					oldColour = (ctx.strokeStyle);
					ctx.strokeStyle = "orange";
					ctx.fillStyle = "orange";
					
					drawLineWithArrows(endLocation,heightLocation,2000,heightLocation,10,10,true,false);
				

					ctx.fillText(inchStart +'"' , (parseInt(endLocation) + (2000-parseInt(endLocation))*0.5), textLocation);
					ctx.strokeStyle = oldColour;
					ctx.fillStyle = oldColour;

					
				}
				
			}
			

ctx.strokeStyle = "orange";
ctx.fillStyle = "orange";
				//More arrows if not full Length	
			
if ((dPosition == "b" || dPosition == "t") && (parseInt($(dZoneDraw).attr("maxwidth")) <= (2000 - (inchWidth)) || (parseInt($(dZoneDraw).attr("minwidth"))) >= (0 + (inchWidth)) ))
{
	var additionalInches = inchStart*inchHeight;	
	//console.log("tb");
	var min = parseInt($(dZoneDraw).attr("minwidth"));
	var max = parseInt($(dZoneDraw).attr("maxwidth"));
	var height;
	var width;
	var textHeight;
	var horizontalTextHeight;
	var horizontalHeight;
	
	
	if (dPosition == "b")
	{
		
		height = 960-additionalInches;
		textHeight = 880-additionalInches;
		horizontalHeight =  parseInt($(dZoneDraw).attr("maxheight")) -70;
		horizontalTextHeight =  parseInt($(dZoneDraw).attr("maxheight")) -10;
		
	}
	else
	{
		height = 70 + additionalInches;
		textHeight = 150 + additionalInches;
		horizontalHeight =  parseInt($(dZoneDraw).attr("minheight")) +70;
		horizontalTextHeight =  parseInt($(dZoneDraw).attr("minheight")) + 50;
	}
			drawLineWithArrows(min + 20, horizontalHeight,max -20,horizontalHeight,10,10,true,true);
		dist = Math.round(difference(min, max)/inchWidth);
		ctx.fillText(dist +'"' , max - 120,horizontalTextHeight);	
	if ( ((2000-max) <= min))
	{
		
		 width = 2000 - ((2000 - max));
		 ////console.log(width +"jj");
		 drawLineWithArrows(width, height,2000,height,10,10,true,false);
		 dist = Math.round((2000-(max))/inchWidth)
		ctx.fillText(dist +'"' , width + (inchWidth*(dist/2)) ,textHeight);	
	}
	else 	if (min != 0)
	{
		
		width = min;
		drawLineWithArrows(0, height,width,height,10,10,false,true);
		dist = Math.round((min)/inchWidth)
		ctx.fillText(dist +'"' , width - (inchWidth*(dist/2)) ,textHeight);	

	}


	
}	

else if ((dPosition == "l" || dPosition == "r") && (parseInt($(dZoneDraw).attr("maxheight")) <= (1000 - (inchHeight)) || (parseInt($(dZoneDraw).attr("minheight"))) >= (0 + (inchHeight)) ))
{
	var additionalInches = inchStart*inchWidth;	

	//console.log(dPosition);
	//console.log("LR");
	var min = parseInt($(dZoneDraw).attr("minHeight"));
	var max = parseInt($(dZoneDraw).attr("maxheight"));
	var height;
	var width;
	var textHeight;
	var verticalWidth;
	var verticalTextWidth;
	
	if (dPosition == "r")
	{
		
		width = 1960 - additionalInches ;
		textWidth = 1920 - additionalInches;
		verticalWidth =  width-10;
		verticalTextWidth =  width-70;
	}
	else
	{
		width = 40 + additionalInches;
		textWidth = 100 + additionalInches;
		verticalWidth =  width+10;
		verticalTextWidth =  width + 70;
	}
	drawLineWithArrows(verticalWidth, min + 20,verticalWidth,max -20,10,10,true,true);
	dist = Math.round(difference(min, max)/inchHeight);
	ctx.fillText(dist +'"' , verticalTextWidth,min + 120);	
//	console.log(max);
//		console.log(1000-inchHeight);
		console.log(difference(min, max))
	if ((1000-min) <= max && min !=0 && max <= (1000-inchHeight) )
	{
		console.log("max");		
		 height = 1000 -  (1000 - max);
		 drawLineWithArrows(width, 1000 ,width,height,10,10,true,false);
		 dist = Math.round((difference(1000, max)/inchHeight));
		ctx.fillText(dist +'"' ,textWidth, height + (inchHeight*(dist/2)));	
	}
	else if (max <= (1000-inchHeight) && min !=0)
	{
		
		height = min;
		drawLineWithArrows(width, 0,width,min,10,10,false,true);
		dist = Math.round(difference(0, min)/inchHeight)
		ctx.fillText(dist +'"' , textWidth, height - (inchHeight*(dist/2)) );	

	}
	
	
}	

					
}

// THIS GUY = A1 https://riptutorial.com/html5-canvas/example/18136/line-with-arrowheads
// x0,y0: the line's starting point
// x1,y1: the line's ending point
// width: the distance the arrowhead perpendicularly extends away from the line
// height: the distance the arrowhead extends backward from the endpoint
// arrowStart: true/false directing to draw arrowhead at the line's starting point
// arrowEnd: true/false directing to draw arrowhead at the line's ending point

//An example crossing the middle of the canvas: drawLineWithArrows(0,500,2000,500,50,50,true,true);

function drawLineWithArrows(x0,y0,x1,y1,aWidth,aLength,arrowStart,arrowEnd){
    var dx=x1-x0;
    var dy=y1-y0;
    var angle=Math.atan2(dy,dx);
    var length=Math.sqrt(dx*dx+dy*dy);
    //
    ctx.translate(x0,y0);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(length,0);
    if(arrowStart){
        ctx.moveTo(aLength,-aWidth);
        ctx.lineTo(0,0);
        ctx.lineTo(aLength,aWidth);
    }
    if(arrowEnd){
        ctx.moveTo(length-aLength,-aWidth);
        ctx.lineTo(length,0);
        ctx.lineTo(length-aLength,aWidth);
    }
    //
    ctx.stroke();
    ctx.setTransform(1,0,0,1,0,0);
}
function exBoxStartCalc()
{



	if ($("#boxfromCentre").prop("checked") == true)
	{
	$("#boxLocation").hide();
	$("#exBoxSW").val((boardWidth/2)-(parseInt($("#exBoxW").val())/2));
	$("#exBoxSH").val((boardHeight/2)-(parseInt($("#exBoxH").val())/2));
	}
	else
	{
		$("#boxLocation").show();
	}


}
function calculateSize() 
{
if ($("#canvas").is(":visible"))
{
 var oldWidth = width;
 var oldHeight = height;
 width = $( "#mapContainer" ).width();
 height = (width/2);
 $( "#canvas" ).width(width);
 $( "#canvas" ).height(height);
	////console.log("pxwidth: " + width + " pxheight: " + height);
  inchToPx();
}
}

function setBoardSize() 
{
var selectedBoard = $("#boardSize").val();
boardHeight = selectedBoard.split(",")[1];
boardWidth = selectedBoard.split(",")[0];
////console.log("boardWidth: " + boardWidth + " boardHeight: " + boardHeight);
$("#boardDesc").replaceWith("<h3 id='boardDesc'>Board Width: "+boardWidth+"&#8221; Board Height: " + boardHeight+"&#8221;</h3>");
$("#boardDescCorner").replaceWith("<h3 id='boardDescCorner'>Board Width: "+boardWidth+"&#8221; Board Height: " + boardHeight+"&#8221;</h3>");

}
function inchToPx() 
{


	inchHeight=(1000/boardHeight);
	inchWidth=(2000/boardWidth);

	////console.log("inch Height: " +inchHeight +" inch Width: "+ inchWidth);
	

}
function deleteDep(dep)
{
	$(dep).parent().remove();
	recountDeps();
	recountObs();
	recountExs();
	reCreatedepZ(false);
	
}
function recountExs()
{
	curEx = 1;
		$(".exEdit").each(function(){
		var wotsit = parseInt($(this).attr("exId"));
if (wotsit != curEx)
{
$(this).attr("exId", curEx);
$(this).text("Exclusion Zone "+curEx);	

}
curEx++;
		});
	
}
function recountObs()
{
	objCount = 1;
	$(".obEdit ").each(function(){
	
	var wotsit = parseInt($(this).attr("obId"));

		if ( wotsit != objCount)
		{
			$(this).attr("obId", objCount);
			$(this).text("Objective "+objCount);
		}
				objCount++;
		
	});
}
function recountDeps()
{
	depZoneId = 1;
	$(".depZ").each(function(){
	
	var wotsit = parseInt($(this).attr("zoneid"));

		if ( wotsit != depZoneId)
		{
			$(this).attr("zoneid", depZoneId);
			$(this).text("Deployment Zone "+depZoneId);
		}
				depZoneId++;
		
	});
}
function editDep(dep)
{	if ($(dep).hasClass("box"))
{
	$("#addDep").click();
	editing = true;
	depExists = true;
	curDep = ($(dep).attr("zoneid"));	
	////console.log($(dep).attr("zoneid"));
	dZoneWidth = ($(dep).attr("dZoneWidth"));	
	dZoneHeight = ($(dep).attr("dZoneHeight"));	
	dHeight = ($(dep).attr("dHeight"));	
	dWidth = ($(dep).attr("dWidth"));		
	$("#boardEdge").val(($(dep).attr("boardEdge")))
	addBox();
//reCreatedepZ(editing, true, "box");
	$("#saveDep").show();
	
}
else if ($(dep).hasClass("corner"))
{
	$("#cornerEdge").val("ignore");
	$("#addCornerDep").click();
	editing = true;
	depExists = true;
	curDep = ($(dep).attr("zoneid"));	
	cHeight =  ($(dep).attr("cornerheight"));
	cWidth =  ($(dep).attr("cornerwidth"));	
	cEdge = ($(dep).attr("corneredge"));
	$("#cornerEdge").val(cEdge);
	$("#cornerHeight").val(cHeight);
	$("#cornerLength").val(cEdge);
	$("#saveDepC").show();
}
	
	
	
}
function reStyle() 
{
	$("label[for='boardSize']").css("font-size","");
	//height '' font-size
}
function checkOverlap(shape)
{

	if (shape == "box")
	{
	
		//Start should always be lower than End
		if (dPosition == "t")
		{
		desStartHeight =  parseInt($("#offSetEdge").val()* inchHeight);
		desEndHeight = ( desStartHeight + ( parseInt($("#zoneDepth").val() * inchHeight )));
		desStartWidth =  parseInt($("#offSetSide").val() * inchWidth);		
		desEndWidth = ( desStartWidth +  parseInt($("#zoneLength").val()) * inchWidth);
		//console.log(desStartHeight+","+desEndHeight+","+desStartWidth+","+desEndWidth);
		}
		else if (dPosition == "b")
		{
		desEndHeight =  1000 - parseInt($("#offSetEdge").val() * inchHeight)	
		desStartHeight = desEndHeight - (parseInt($("#zoneDepth").val() * inchHeight))
		desStartWidth =  parseInt($("#offSetSide").val() * inchWidth);		
		desEndWidth = (desStartWidth) +  parseInt($("#zoneLength").val()) * inchWidth;
		//console.log(desStartHeight+","+desEndHeight+","+desStartWidth+","+desEndWidth);
		}
		else if (dPosition == "r")
		{
		desStartHeight = parseInt($("#offSetSide").val()*inchHeight)	
		desEndHeight = desStartHeight + parseInt($("#zoneLength").val()*inchHeight)	
		desEndWidth =  2000 - parseInt($("#offSetEdge").val()*inchWidth);		
		desStartWidth = (desEndWidth)- parseInt($("#zoneDepth").val()) *inchWidth;		
		//console.log(desStartHeight+","+desEndHeight+","+desStartWidth+","+desEndWidth);
		}
				else if (dPosition == "l")
		{
		desStartHeight = parseInt($("#offSetSide").val() * inchHeight);
		desEndHeight = desStartHeight + parseInt($("#zoneLength").val()*inchHeight)	;
		desStartWidth = (parseInt($("#offSetEdge").val()) * inchWidth);		
		desEndWidth = (desStartWidth)+ parseInt($("#zoneDepth").val()) *inchWidth;		
		//console.log(desStartHeight+","+desEndHeight+","+desStartWidth+","+desEndWidth);
		}


	}
	

	////console.log("ok");
	
}
 ///   ctx.beginPath();
		//Length, Height
 //   ctx.moveTo(0, 0);
 //   ctx.lineTo(100, 0);
//    ctx.lineTo(0, 100);
 //   ctx.fill();
 