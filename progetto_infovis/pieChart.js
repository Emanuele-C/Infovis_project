const initPieChart = function (domId){

    let cont = {};
    cont["4"] = 0;
    cont["6"] = 0;
    cont["error"] = 0;

    let width = 500,
        height = 400,
        margin = 0;
    let radius = Math.min(width, height) / 3 - margin;
    let dataset = {ipv4:0, ipv6:0};

    let svg = d3.select(domId)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    let color = d3.scaleOrdinal()
        .domain(dataset)
        .range(["#6495ed", "#ff8c00"]);

    function render(dati) {

        let pie = d3.pie()
            .sort(null)
            .value(function(d) {
                return d.value;
            });

        let data_ready = pie(d3.entries(dati));
            
        let arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        let path = svg.selectAll(".arc")
            .data(data_ready);
            

        let pathEnter = path.enter().append("path").attr("class","arc")
            .attr("fill", function(d) {
                return color(d.data.key);

            })
            .attr("d", arc)
            .attr("stroke", "white")
            .style("stroke-width", "1px")
            .style("opacity", 9);
        
        let lab = svg.selectAll(".label")
            .data(data_ready)

        let textEnter = lab.enter().append("text").attr("class","label")
            .text(function(d){
                
                return (d.data.key+"\n"+d.data.value + "%")
            })
            .attr("transform", function(d) {
                return "translate(" + d3.arc()
                    .innerRadius(30)
                    .outerRadius(radius)
                    .centroid(d) + ")";
            })
            .style("text-anchor", "middle")
            .style("font-size", 15);

            svg.selectAll(".label")
                    .data(data_ready)
                    .exit()
                    .remove();

                svg.selectAll(".arc")
                    .data(data_ready)
                    .exit()
                    .remove()
        
        path
            .attr("fill", function(d) {
                return color(d.data.key);

            })
            .attr("d", arc)
            .attr("stroke", "white")
            .style("stroke-width", "1px")
            .style("opacity", 9);

        lab
            .text(function(d){
                
                return (d.data.key+"\n"+d.data.value + "%")
            })
            .attr("transform", function(d) {
                return "translate(" + d3.arc()
                    .innerRadius(30)
                    .outerRadius(radius)
                    .centroid(d) + ")";
            })
            .style("text-anchor", "middle")
            .style("font-size", 15);
        
            


        let pathUpdate = path.attr("d", arc);

    }

    function update(cont) {

        let tot = cont["4"]+cont["6"];

        let perIpv4 = parseFloat(((cont["4"]*100)/tot).toFixed(2));
        let perIpv6 = parseFloat(((cont["6"]*100)/tot).toFixed(2));

        dataset = {ipv4:perIpv4, ipv6:perIpv6};
        
        render(dataset);
    }

    return function(result){

        if (result.result[0].af === undefined && !("dst_addr" in result.result[0]) ){
            cont["error"]++;
        }else{
            if (result.result[0].af == "6"){
                cont["6"]++;
            }
            else {
                cont ["4"]++;
            }
        }
        update(cont);
    }
}