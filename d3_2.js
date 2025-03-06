// Données utilisées dans la création du graphique
const data = [
    { category: 'A', part1: 30, part2: 20 },
    { category: 'B', part1: 40, part2: 10 },
    { category: 'C', part1: 20, part2: 30 },
];

// Définition de la hauteur et de la largeur du graphique (incluant une marge)
const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 500 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

// Création de l'élément SVG pour le premier graphique et ajout du titre
const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 40) // Ajoutez de l'espace pour le titre
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top + 20})`); // Positionnement pour ne pas superposer le titre

// Ajouter le titre au premier graphique
svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)  // Place le titre au-dessus du graphique
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text("Graphique ");

// Échelles pour le premier graphique
const x = d3.scaleBand()
    .domain(data.map(d => d.category))
    .range([0, width])
    .padding(0.1);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.part1 + d.part2)])
    .nice()
    .range([height, 0]);

const color = d3.scaleOrdinal()
    .domain(["part1", "part2"])
    .range(["#1f77b4", "#ff7f0e"]);

// Empilement des données
const stack = d3.stack()
    .keys(["part1", "part2"]);

const stackedData = stack(data);

// Ajout des barres empilées
svg.selectAll(".layer")
    .data(stackedData)
    .enter().append("g")
    .attr("class", "layer")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("x", d => x(d.data.category))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth());

// Ajout des axes
svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("class", "axis y-axis")
    .call(d3.axisLeft(y));

// Second graphique avec un regroupement des barres (bar chart côte à côte)
const x0 = d3.scaleBand()
    .domain(data.map(d => d.category))
    .range([0, width])
    .padding(0.1);

const x1 = d3.scaleBand()
    .domain(["part1", "part2"])
    .range([0, x0.bandwidth()])
    .padding(0.05);

const y2 = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.part1 + d.part2)])
    .nice()
    .range([height, 0]);

// Création d'un autre groupe pour le second graphique et ajout du titre
const svg2 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 40) // Ajoutez de l'espace pour le titre
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top + 20})`);

// Ajouter le titre au deuxième graphique
svg2.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2) // Positionne le titre au-dessus du graphique
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text("Graphique Barres Groupées");

// Ajout des barres pour le second graphique
svg2.selectAll(".category")
    .data(data)
    .enter().append("g")
    .attr("class", "category")
    .attr("transform", d => `translate(${x0(d.category)},0)`)
    .selectAll("rect")
    .data(d => ["part1", "part2"].map(key => ({ key: key, value: d[key] })))
    .enter().append("rect")
    .attr("x", d => x1(d.key))
    .attr("y", d => y2(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", d => height - y2(d.value))
    .attr("fill", d => color(d.key));

// Ajout des axes au second graphique
svg2.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0));

svg2.append("g")
    .attr("class", "axis y-axis")
    .call(d3.axisLeft(y2));
