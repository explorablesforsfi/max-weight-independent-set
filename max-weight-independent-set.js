function contains(arr,elem)
{
  return ! (arr.indexOf(elem) == -1);
}

function link_id(source,target){
  if (source > target)
  {
    let tmp = source;
    source = target;
    target = tmp;
  }

  return "link-"+source+"-"+target;
}

function forbid(id)
{
  d3.select("node")
}

const width = 600;
const height = 300;
const svg = d3.select('#explorable_container')
              .append("svg")
              .attr('width',width)
              .attr('height',height);

let this_set = [];

let dod_origin = [width/2, height/2];
let radius = 15;
let deselect_color = "#333";
let select_color = "#d95f02";
let default_link_color = "#999";
let default_link_width = 1.5;

let isSelected = [];
let graph = [];
let isForbidden = [];

let can_play = true;
let graph_url = './tree/tree.json';
/*
graph_url = './tree/random_tree.json';
let line = d3.line();
let base_path;

//graph_url = './data/test.json';
let celebration_duration = 250;
let celebration_ease = d3.easeCircleInOut;
let celebration_line = d3.line().x(d=>d[0]).y(d=>d[1]).curve(d3.curveBasis);
let celebration_path;
let celebration_text;
// funky celebration
let celeb_data_0 = [[1.2*width/3.5,height/5],[1.2*width/2,height/20],[2.6*width/3.5,height/5]];
let celeb_data_1 = [[1.2*width/3.5,height/5],[0.8*width/2,height/20],[2.6*width/3.5,height/5]];
//not so funky celebration
celeb_data_0 = [[width/5,height/8],[width,height/8]];
celeb_data_1 = [[width/2.5,height/8],[width,height/8]];
*/
let margin = radius+5;

let o = {
    size: [width/2-margin, height-2*margin],
    x: function(d) { return d.x+margin; },
    y: function(d) { return d.y+margin; }
}

var treemap, tree, links, node, node_group, link, coin, coin_group, weight_label;
let extra_top_margin = 60;

function get_coin_x_y(index)
{
  let right_width = width/2 - 2*margin;
  let right_height = height - 2*margin-extra_top_margin;
  let Nx = Math.floor(right_width / (radius+margin));
  let Ny = Math.floor(right_height / (radius+margin));

  let x = Math.floor(index / Ny);
  let y = Math.floor(index % Ny);
  let xScale = d3.scaleLinear().domain([0,Nx-1]).range([width/2+margin+radius, 
                                                        width/2+margin+radius+(Nx)*(radius+margin)]);
  let yScale = d3.scaleLinear().domain([0,Ny-1]).range([extra_top_margin+radius, 
                                                        extra_top_margin+radius+(Ny)*(radius+margin)]);
  return [xScale(x),yScale(y)];
}


// load the data and create the svg elements

d3.json(graph_url).then(function(data){

    treemap = d3.tree().size(o.size);
    tree = d3.hierarchy(data);
    tree = treemap(tree);

    let all_x = [];
    let all_y = [];
    tree.descendants().forEach(function(tmp){
        all_x.push(tmp.x);
        all_y.push(tmp.y);
        isSelected.push(false);
        isForbidden.push(false);
    });
    
    

    links = tree.descendants().slice(1);
    svg.selectAll(".link")
        .data(links)
      .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
       return "M" + o.x(d) + "," + o.y(d)
         + "C" + o.x(d) + "," + (o.y(d) + o.y(d.parent)) / 2
         + " " + o.x(d.parent) + "," +  (o.y(d) + o.y(d.parent)) / 2
         + " " + o.x(d.parent) + "," + o.y(d.parent);
       });


    // Create the node circles.
    coin_group = svg.selectAll(".coin-node")
        .data(tree.descendants())
      .enter()
    		.append("g")
        .attr("id",d => "coin-group")
        .attr("transform",function (d) { return "translate("+o.x(d)+" "+o.y(d)+")"});

    coin = coin_group.append("circle")
        .attr("class", "node")
        .attr("id",d => "coin-node-"+d.data.id)
        .attr("r", radius)
        .attr("cx", 0)
        .attr("cy", 0);


   coin_group.append("text")
        .attr("class","label")
        .attr("font-size", radius+"px")
        .text(function (d) {return d.data.weight;})
        .attr("x", 0)
        .attr("dy", radius/3)
        .attr("y", 0);

    // Create the node circles.
    node_group = svg.selectAll(".node-group")
        .data(tree.descendants())
      .enter()
    		.append("g")
        .attr("id",d => "node-group-"+d.data.id)
        .attr("transform",function (d) { return "translate("+o.x(d)+" "+o.y(d)+")"})
        .on("mouseover", handleMouseOver)
        .on("click", handleMouseClick)
        .on("mouseout", handleMouseOut)
  ;

    node = node_group.append("circle")
        .attr("class", "node")
        .attr("id",d => "node-"+d.data.id)
        .attr("r", radius)
        .attr("cx", 0)
        .attr("cy", 0);


   node_group.append("text")
        .attr("class","label")
        .attr("font-size", radius+"px")
        .text(function (d) {return d.data.weight;})
        .attr("x", 0)
        .attr("dy", radius/3)
        .attr("y", 0);

  weight_label = svg.append("text")
                    .attr("font-size",extra_top_margin/3)
                    .attr("x",width/2+margin)
                    .attr("y",margin+extra_top_margin/3)
                    .text("Set weight: 0")
                      ;
  /*

  base_path = svg.append("g")
                .attr("stroke",select_color)
                .attr("stroke-width",3.0)
                .selectAll("line")
              ;

  celebration_path = svg.append("g")
    .attr("stroke-width",1)
    .attr("stroke","rgba(0,0,0,0)")
    .attr("fill","rgba(0,0,0,0)")
    .append("path")
    .attr("d",celebration_line(celeb_data_0))
    .attr("id","celeb")
  ;
              
  celebration_text = svg.append("text")
    .attr("font-family", "Helvetica")
    .attr("id","celeb-text")
    .append("textPath")
    .attr("xlink:href","#celeb");

  base_node = svg.append("g")
      .attr("stroke", "#333")
    .selectAll("circle")
    .data(tree);
  base_node
    .join("circle")
      .attr("id", function(d, i){ return "node-"+i; })
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", radius)
      .attr("fill", "#fff")
      .attr("stroke-width", 1)
      .on("mouseover", handleMouseOver)
      .on("click", handleMouseClick)
      .on("mouseout", handleMouseOut);

  if (show_labels)
  {
    base_label = svg.append("g")
      .selectAll("text")
      .data(tree)
      .join("text")
        .attr("id", function(d, i){ return "text-"+i; })
        .attr("x", d => xScale(d.x)+scale/4)
        .attr("y", d => yScale(d.y)+scale/4)
        .text(d => d.id);
  }

  base_node.append("title")
      .text(d => d.id);
    */
});


function reset() {
  this_set.length = 0;
  can_play = true;
  isSelected = tree.descendants().map(n => false);
  isForbidden = tree.descendants().map(n => false);
  update_coins();

  let selection = "";
  for(let n=0; n<tree.descendants().length; ++n)
  {
    if (selection.length >0)
      selection += ", ";
    selection += "#node-"+n;
  }
  d3.selectAll(selection)
    .transition()
    .attr("class","node");
  /*
  base_link.transition()
      .attr("stroke", default_link_color)
      .attr("stroke-opacity", 1.0)
      .attr("stroke-width",  default_link_width)
     ;

  base_node.transition()
      .attr("fill", "#fff")
      .attr("stroke-width", 1)
      .attr("r",radius)
      ;

  */
  /*
  celebration_text
      .text("")
  ;
  */
}

function handleMouseOver(d) {  // Add interactivity
  if (!can_play)
    return;

  let i = d.data.id;

  if (!isForbidden[i])
  {
    d3.select("#node-"+i)
      .attr("stroke-width",3)
    ;
    d3.select("#node-group-"+i)
      .attr("cursor","pointer")
    ;
  }
}

function handleMouseOut(d) {
  let i = d.data.id;

  if (!isForbidden[i])
  {
    d3.select("#node-"+i)
      .attr("stroke-width", 2.0)
    ;
    d3.select("#node-group-"+i)
      .attr("cursor","default")
    ;
  }
}

function handleMouseClick(d) {
  if (!can_play)
    return;

  let i = d.data.id;

  if (!isForbidden[i])
  {
    if (!isSelected[i])
    {
      this_set.push(i);
      isSelected[i] = true;
      d3.select("#node-"+i)
        .transition()
        .attr("class","selected")
      ;
      if (typeof(d.children) != "undefined")
      {
        d.children.forEach(function (child){
          let j = child.data.id;
          isForbidden[j] = true;
          d3.select("#node-"+j)
            .transition()
            .attr("class","forbidden")
          ;
        });
      }
      let par = d.parent;
      if (par !== null)
      {
        isForbidden[par.data.id] = true;
        d3.select("#node-"+par.data.id)
          .transition()
          .attr("class","forbidden")
        ;
      }
    }
    else
    {
      this_set.splice( this_set.indexOf(i), 1 );
      isSelected[i] = false;
      d3.select("#node-"+i)
        .transition()
        .attr("class","node")
      ;
      if (typeof(d.children) != "undefined")
      {
        d.children.forEach(function (child){
          let j = child.data.id;
          isForbidden[j] = false;
          if (typeof(child.children) != "undefined")
          {
            child.children.forEach(function(grandchild)
              {
                isForbidden[j] = isForbidden[j] || isSelected[grandchild.data.id];
              });
          }
          if (!isForbidden[j])
          {
            d3.select("#node-"+j)
              .transition()
              .attr("class","node")
            ;
          }
        });
      }
      let par = d.parent;
      if (par !== null)
      {
        isForbidden[par.data.id] = false;
        let grandpar = par.parent;
        if (grandpar !== null)
        {
          isForbidden[par.data.id] = isForbidden[par.data.id] || isSelected[grandpar.data.id];
        }
        par.children.forEach(function(child)
        {
          isForbidden[par.data.id] = isForbidden[par.data.id] || isSelected[child.data.id];
        });
        if (!isForbidden[par.data.id])
        {
          d3.select("#node-"+par.data.id)
            .transition()
            .attr("class","node")
          ;
        }
      }
    }
  }
  update_coins();
}

function update_coins()
{
  coin_group
    .transition()
    .attr("transform",function(d)
      {
        let index = this_set.indexOf(d.data.id);
        if (index>=0)
        {
          let pos = get_coin_x_y(index);
          return "translate("+pos[0]+" "+pos[1]+")";
        }
        else
        {
          return "translate("+o.x(d)+" "+o.y(d)+")";
        }
      });

  let weight_sum = 0;
  tree.descendants().forEach(function(n){
    let index = this_set.indexOf(n.data.id);
    if (index >= 0)
      weight_sum += n.data.weight;
  });
  weight_label.text("Set weight: "+ weight_sum);
}

function celebrate()
{
  let celebration = "path";
  can_play = false;

  let link_selection = "";
  let node_selection = "";

  for (let i=0; i<path.length-1; ++i)
  {
    if (link_selection.length > 0)
    {
      link_selection += ",";
      node_selection += ",";
    }

    link_selection += "#" + link_id(path[i],path[i+1]);
    node_selection += "#node-" + path[i];
  }

  node_selection += ",#node-" + path[path.length-1];

  if (contains(graph[path[0]], last_selected))
  {
    celebration = "cycle";
    link_selection += ",#" + link_id(path[0],last_selected);
  }
  celebration_text
    .text("YOU FOUND A "+celebration.toUpperCase()+"!")
    ;

  function repeat(){
    d3.select("#celeb-text")
      .transition()
      .ease(celebration_ease)
      .duration(celebration_duration)
      .attr('fill',select_color)
      //.attr("transform","rotate(180 "+dod_origin[0]+" "+dod_origin[1]+")")
      .transition()
      .ease(celebration_ease)
      .duration(celebration_duration)
      .attr('fill','#000')
      //.attr("transform","rotate(360 "+dod_origin[0]+" "+dod_origin[1]+")")
    ;



    d3.select("#celeb")
      .transition()
      .ease(celebration_ease)
      .duration(celebration_duration)
      .attr("d",celebration_line(celeb_data_1))
      .transition()
      .ease(celebration_ease)
      .duration(celebration_duration)
      .attr("d",celebration_line(celeb_data_0))
    ;

      
    d3.selectAll(node_selection)
      .transition()
      .ease(celebration_ease)
      .duration(celebration_duration)
      .attr("r",Math.sqrt(2)*radius)
      .transition()
      .ease(celebration_ease)
      .duration(celebration_duration)
      .attr("r",radius);

    d3.selectAll(link_selection)
      .transition()
      .ease(celebration_ease)
      .duration(celebration_duration)
      .attr("stroke-width",7)
      .transition()
      .ease(celebration_ease)
      .duration(celebration_duration)
      .attr("stroke-width",3)
      .on("end",function(){
        d3.timeout(repeat,0);
      });
  }

  repeat();
}
