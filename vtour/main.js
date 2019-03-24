// Lib function
function format_hotspot(str) {
    str = str.replace(/_/g, ' ');
    str = str.substr(str.indexOf(" ") + 1);
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
};

// Global krpano interface (will be set in the onready callback)
var krpano = null;

embedpano({
    swf: "tour.swf",
    xml: "tour.xml",
    target: "pano",
    id: "krpanoSWFObject",
    onready: krpano_ready,
    html5: "auto",
    consolelog: true,
    passQueryParameters: true
});

function krpano_ready(krpano_interface) {
    krpano = krpano_interface;
}

function krpano_is_ready() {
    if (krpano && krpano.call) {
        krpano.set("events.onloadcomplete", "js( call_func() )");
        krpano.set("events.keep", true);
    }
}

function call_func() {
    // Put any function that you want to call inside this function
    html5_title();
    ajax_get('../dist/data/data.json', function(data) {
        document.getElementById("title").innerHTML = 'Untitled';
        document.getElementById("description").innerHTML = 'Belum ada deskripsi.';

        var title = krpano.get("scene[get(xml.scene)].title");
        console.log(title);
        // iterate over each element in the array
        for (var i = 0; i < data.length; i++){
          // look for the entry with a matching `title` value
          if (data[i].title == title){
            // we found it
            document.getElementById("title").innerHTML = data[i].title;
            document.getElementById("description").innerHTML = data[i].description;
          }
        } 
    });
}

function html5_title() {
    var hotspot_count = krpano.get('hotspot.count');
    var hotspotArr = krpano.get('hotspot').getArray();
    for (i = 0; i < hotspot_count; i++) {
        hotspotArr[i]['sprite'].setAttribute('title', format_hotspot(krpano.get('hotspot[ ' + i + '].linkedscene')));
        //console.log(format_hotspot(krpano.get('hotspot[ ' + i + '].linkedscene')));
    }
}

function get_current_scene_title() {
    var title = krpano.get("scene[get(xml.scene)].title");
    return title;
}

function moveto(mode, tov) {
    if (krpano) {
        // Need to specify toh and tov manually
        // krpano.call("moveto(" + toh + "," + tov + ")");
        // Get hlookat value based on current view
        var hlookat = krpano.get("view.hlookat");

/*        krpano.set("view.fov", 0);
        krpano.set("view.fovmax", 140);
        krpano.set("view.hlookat", 0);
        krpano.set("view.vlookat", 0);
        krpano.set("view.maxpixelzoom", 2.0);*/

        switch(mode) {
          case 'bird':
            krpano.set("view.pannini", false);
            krpano.set("view.stereographic", true);
            krpano.set("view.fov", 130);
            krpano.set("view.fovmax", 150);
            krpano.set("view.hlookat", 130);
            krpano.set("view.vlookat", 30);
            krpano.call("tween(view.fisheye, 1.0, distance(1.0, 0.8), easeoutquad)");
            break;
          case 'high':
            krpano.set("view.pannini", true);
            krpano.set("view.stereographic", false);
            krpano.call("tween(view.architectural, 1.0, distance(1.0,0.5))");
            krpano.call("tween(view.pannini,       0.0, distance(1.0,0.5))");
            krpano.call("tween(view.fisheye,       0.0, distance(1.0,0.5))");

            krpano.set("view.fov", 130);
            krpano.set("view.fovmax", 150);
            krpano.set("view.maxpixelzoom", 1.0);
            
            krpano.call("moveto(" + hlookat + "," + tov + ")");
            break;
          case 'low':
            krpano.set("view.pannini", false);
            krpano.set("view.stereographic", true);
            krpano.set("view.fov", 80);
            krpano.set("view.fovmax", 150);
            krpano.set("view.hlookat", 130);
            krpano.set("view.vlookat", 30);
            krpano.call("tween(view.fisheye, 1.0, distance(1.0, 0.8), easeoutquad)");
            break;
          default:
            krpano.set("view.pannini", true);
            krpano.set("view.stereographic", false);
            krpano.call("tween(view.architectural, 1.0, distance(1.0,0.5))");
            krpano.call("tween(view.pannini,       0.0, distance(1.0,0.5))");
            krpano.call("tween(view.fisheye,       0.0, distance(1.0,0.5))");

            krpano.set("view.fov", 70.000);
            krpano.set("view.fovmax", 140);
            krpano.set("view.maxpixelzoom", 4.0);
            
            krpano.call("moveto(" + hlookat + "," + tov + ")");
        }
    }

}

function moveto_stereo() {
    if (krpano) {
        krpano.set("view.pannini", false);
        krpano.set("view.stereographic", true);
        krpano.set("view.fov", 130);
        krpano.set("view.fovmax", 150);
        krpano.set("view.hlookat", 130);
        krpano.set("view.vlookat", 30);
        krpano.call("tween(view.fisheye, 1.0, distance(1.0, 0.8), easeoutquad)");
    }
}

function get_lookat() {
    if (krpano) {
        var hlookat = krpano.get("view.hlookat");
        var vlookat = krpano.get("view.vlookat");
        var fov = krpano.get("view.fov");

        document.getElementById("currentview").innerHTML = 'hlookat="' + hlookat.toFixed(2) + '" ' + 'vlookat="' + vlookat.toFixed(2) + '" ' + 'fov="' + fov.toFixed(2) + '" ';
    }
}

function message(text) {
    if (krpano) {
        var flash_text = document.getElementById('flash-text');
        flash_text.innerText = text;

        setTimeout(function() {
            flash_text.style.display = (flash_text.style.display == 'none' ? '' : 'none');

            setTimeout(function() {
                flash_text.style.display = (flash_text.style.display == 'none' ? '' : 'none');
            }, 3500);
        }, 500);
    }
}

// AJAX Call
function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };
 
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
