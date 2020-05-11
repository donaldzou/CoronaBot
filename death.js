var death_map;
var death_case_chart;
var death_case_dataset = [];
var death_age_chart;
var death_gender_chart;
var prov_death = {};
var prov_death_data = [];
var prov_group = L.featureGroup();
var region_group = L.featureGroup();
var region_death = {};
var screen_width = $(window).width()
function death(){
    if($('.death_link').hasClass('active') == false){
        if ($('.death').hasClass('loaded')){
            $(".nav-link").removeClass("active");
            $(".death_link").addClass("active");
            $(".tab").fadeOut()
            $(".death").fadeIn()
        }
        else{
            $(".death").addClass("loaded")
            $(".nav-link").removeClass("active");
            $(".death_link").addClass("active");
            $(".tab").fadeOut()
            $(".death").fadeIn()
            load_death_data();
            
            death_map = L.map('death_map').setView([58.972, -97.486], 4);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/dark-v10',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiZG9uYWxkem91IiwiYSI6ImNrOHN1M2JrZTBjZGEzbnI0amhzNG13dTYifQ.uTvTibSyi2lvdrbT4ipj4w'
            }).addTo(death_map);
        
            // for (var a in province_list) {
            //     $("#death-province-select").append('<option value="' + province_list[a] + '">' + province_list[a] + '</option>')
            // }

            //Init death case
            if (screen_width <= 768) {
                $(".death_case .card-body").append('<canvas id="death_case" width="500" height="700"></canvas><p class="graph_note" style="text-align: right; font-size:10px"></p>')
            }
            else {
                $(".death_case .card-body").append('<canvas id="death_case" width="500" height="200"></canvas><p class="graph_note" style="text-align: right; font-size:10px"></p>')
            }
            var ctx = document.getElementById("death_case")
            death_case_chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: []
                },
                responsive: true,
                options: {
                    scales: {
                        yAxes: [{
                            gridLines:{
                                color:'rgba(255,255,255,0.2)'
                            },
                            ticks: {
                                beginAtZero: true,
                                fontColor: 'white'
                            },
                            scaleLabel:{
                                display: true,
                                labelString:"Cases"
                            }
                        }],
                        xAxes: [{   
                            ticks: {
                                fontColor: "white"
                            },
                            gridLines:{
                                color:'rgba(255,255,255,0.2)'
                            },
                            scaleLabel:{
                                display:true,
                                labelString:"Dates"
                            }
                        }]
                    },
                    legend: {
                        labels: {
                            // This more specific font property overrides the global property
                            fontColor: 'white'
                        }
                    },  
                }
            });

            for (var n in Object.keys(prov_death)){
                var temp_data = {
                    label:  Object.keys(prov_death)[n],
                    data: [],
                    borderColor: color_list[n], 
                    fill: false
                }
                var current = prov_death[Object.keys(prov_death)[n]]
                for (var n in Object.keys(current)){
                    temp_data.data.push(current[Object.keys(current)[n]])
                }
                death_case_dataset.push(temp_data)
            }
            death_case_chart.data.labels = Object.keys(prov_death.Alberta)
            death_case_chart.data.datasets = death_case_dataset
            death_case_chart.update()











            //Append Age
            for (var a in deathDict["cases"]){
                if (deathDict['age'][deathDict["cases"][a]['age']] == undefined){
                    deathDict['age'][deathDict["cases"][a]['age']] = 1
                }
                else{
                    deathDict['age'][deathDict["cases"][a]['age']]++
                }
            }
            //Init age chart
            if (screen_width <= 768) {
                $(".death_age .card-body").append('<canvas id="death_age_table" width="500" height="400"></canvas><p class="graph_note" style="text-align: right; font-size:10px"></p>')
            }
            else {
                $(".death_age .card-body").append('<canvas id="death_age_table" width="500" height="200"></canvas><p class="graph_note" style="text-align: right; font-size:10px"></p>')
            }
            var ctx = document.getElementById("death_age_table");
            death_age_chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: "# of cases",
                        data: [],
                        borderWidth: 1,
                        backgroundColor: '#17a2b8',
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [{
        
                            gridLines: {
                                color: 'rgba(255,255,255,0.2)'
                            },
                            ticks: {
                                maxRotation: 90,
                                minRotation: 80
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Ages"
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                color: 'rgba(255,255,255,0.2)'
                            },
                            ticks: {
                                beginAtZero: true
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "# of cases"
                            }
                        }]
                    }
                }
            });
            load_death_age_chart();
            //Append Gender
            for (var n in deathDict['cases']){
                if (deathDict['gender'][deathDict["cases"][n]['sex']] == undefined){
                    deathDict['gender'][deathDict["cases"][n]['sex']] = 1
                }
                else{
                    deathDict['gender'][deathDict["cases"][n]['sex']]++
                }
            }
            //Init gender chart
            if (screen_width <= 768) {
                $(".death_gender .card-body").append('<canvas id="death_gender_table" width="500" height="400"></canvas><p class="graph_note" style="text-align: right; font-size:10px"></p>')
            }
            else {
                $(".death_gender .card-body").append('<canvas id="death_gender_table" width="500" height="200"></canvas><p class="graph_note" style="text-align: right; font-size:10px"></p>')
            }
            var ctx = document.getElementById("death_gender_table");
            death_gender_chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: "# of cases",
                        data: [],
                        borderWidth: 1,
                        backgroundColor: '#17a2b8',
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [{
        
                            gridLines: {
                                color: 'rgba(255,255,255,0.2)'
                            },
                            ticks: {
                                maxRotation: 90,
                                minRotation: 80
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Ages"
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                color: 'rgba(255,255,255,0.2)'
                            },
                            ticks: {
                                beginAtZero: true
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "# of cases"
                            }
                        }]
                    }
                }
            });
            load_death_gender_chart(); 
            load_death_map();
            load_death_table();
        }
    }
}

function load_death_data(){
   //Get province mortality
   $.ajax({
       type: "GET",
       url: "https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/timeseries_prov/mortality_timeseries_prov.csv",
       dataType: "text",
       async:  false,
       success: function (data) {
           var temp = $.csv.toObjects(data)
           for (var n in temp){
               if (prov_death[temp[n]['province']] == undefined){
                prov_death[temp[n]['province']] = {}
               }
               if (prov_death[temp[n]['province']][temp[n]['date_death_report']] == undefined){
                prov_death[temp[n]['province']][temp[n]['date_death_report']] = temp[n]['cumulative_deaths']
               }
           }
       }
    });
    
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/timeseries_hr/mortality_timeseries_hr.csv",
        dataType: "text",
        success: function (data) {
            var temp = $.csv.toObjects(data)
            for (var n in temp){
                if (region_death[temp[n]['province']] ==  undefined){
                    region_death[temp[n]['province']] = {}
                }
                if (region_death[temp[n]['province']][temp[n]['health_region']] == undefined){
                    region_death[temp[n]['province']][temp[n]['health_region']] = {}
                }
                if (region_death[temp[n]['province']][temp[n]['health_region']][temp[n]['date_death_report']] == undefined){
                    region_death[temp[n]['province']][temp[n]['health_region']][temp[n]['date_death_report']] = temp[n]['cumulative_deaths']
                }
            }
        }
    });
    for (var a in Object.keys(region_death)) {
        $("#death-province-select").append('<option value="' + Object.keys(region_death)[a] + '">' + Object.keys(region_death)[a] + '</option>')
    }
    
}

function load_death_map(){
     // Load death map
     for (var n in Object.keys(prov_death).sort()){
        var cur = Object.keys(prov_death)[n]
        var d = Object.keys(prov_death[cur])
        var last = d[d.length - 1]

        var radi = prov_death[cur][last] * 100 + 30000
        var circle = L.circle([prov_geocode[cur]['lat'], [prov_geocode[cur]['lon']]], {
            color: color_list[n],
            fillColor: color_list[n],
            fillOpacity: 0.5,
            radius: radi
        }).addTo(prov_group);
        circle.bindPopup("<h5>" + cur + "</h5><p>" + prov_death[cur][last] + " deaths</p>")

        death_map.addLayer(prov_group)
        $("#death_map").fadeIn(function(){
            death_map.invalidateSize();
        })
        
    }
}

function update_death_map(){
    $.ajax({
        type: "GET",
        url: "geo_data/" + $("#death-province-select").val() + '.json',
        dataType: "text",
        success: function (response) {
            var temp_geo = JSON.parse(response)
            for (var n in temp_geo["features"]) {
                var current_name = temp_geo["features"][n]["properties"]["ENG_LABEL"]
                var current_prov = $("#death-province-select").val()
                var local_name = geo_code[$("#death-province-select").val()][current_name]
                if (Object.keys(region_death[current_prov]).includes(local_name)){
                    var last_day = Object.keys(region_death[current_prov][local_name])[Object.keys(region_death[current_prov][local_name]).length -1]
                    temp_geo["features"][n]["properties"]["AMOUNT"] = region_death[current_prov][local_name][last_day].toString()
                    temp_geo["features"][n]["properties"]["AMOUNT_INT"] = region_death[current_prov][local_name][last_day]
                    temp_geo["features"][n]["properties"]["NAME"] = local_name 
                }
                else{
                    temp_geo["features"][n]["properties"]["AMOUNT"] = '0'
                    temp_geo["features"][n]["properties"]["AMOUNT_INT"] = 0
                    temp_geo["features"][n]["properties"]["NAME"] = local_name 
                }
            }
            L.geoJSON(temp_geo, {
                style: function (feature) {
                    return {
                        color: getColor(feature.properties.AMOUNT_INT),
                        fillOpacity: 0.3,
                        weight: 1
                    };
                }
            }).bindPopup(function (layer) {
                var str = "<h4>" + layer.feature.properties.NAME + "</h4><h6>" + layer.feature.properties.AMOUNT + " cases</h6>"
                return str;
            }).addTo(region_group);
            death_map.removeLayer(prov_group)
            death_map.addLayer(region_group)
            death_map.setView(new L.LatLng(prov_geocode[$("#death-province-select").val()]['lat'], prov_geocode[$("#death-province-select").val()]['lon']), 5);

        }
    });
}






function load_death_table(){
    for (var n in Object.keys(prov_death)){
        var cur = Object.keys(prov_death)[n]
        var d = Object.keys(prov_death[cur])
        var last = d[d.length - 1]
        $(".death_table tbody").append('<tr><th scope="row">'+cur+'</th><td>'+prov_death[cur][last]+'</td></tr>')
    }
}

function load_death_age_chart(){
    if ($("#death-province-select").val() == 'Canada'){
        var chart_label = Object.keys(deathDict.age)
        var data_label = deathDict.age
        $(".death_age .graph_note").text("*"+ data_label['Not Reported']+ ' cases not reported')
        if (chart_label.includes("Not Reported")) {
            chart_label.splice(chart_label.indexOf("Not Reported"), 1)
        }
    }
    for (var n in chart_label) {
        death_age_chart.data.labels.push(chart_label[n])
        death_age_chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data_label[chart_label[n]]);
        });
        death_age_chart.update();
    }

}

function load_death_gender_chart(){
    if ($("#death-province-select").val() == 'Canada'){
        var chart_label = Object.keys(deathDict.gender).sort()
        var data_label = deathDict.gender
        $(".death_gender .graph_note").text("*"+ data_label['Not Reported']+ ' cases not reported')
        if (chart_label.includes("Not Reported")) {
            chart_label.splice(chart_label.indexOf("Not Reported"), 1)
        }
    }
    for (var n in chart_label) {
        death_gender_chart.data.labels.push(chart_label[n])
        death_gender_chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data_label[chart_label[n]]);
        });
        death_gender_chart.update();
    }
}



$('#death_get_province').click(function(){
    update_death_map();
})