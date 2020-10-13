getDateAndHoursList = () => {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('get', '/tracker/dashboard', true);
        
        xhr.onload = function() {
            if (this.status === 200) {
                const response = JSON.parse(xhr.response);
                
                let dataList = []
                for (let res of response.result)
                    dataList.push({date: res.date, hours: parseFloat(res.hours)});
                
                resolve(dataList);
            }
            else {
                reject(new Error(`Response status: ${this.status}`));
            }
        }
        xhr.send();
    });
}

getDataToDisplay = async() => {
    try {
        var data = await getDateAndHoursList();
        render(data);
    }
    catch (ex) {
        console.log("Error getting Project List", ex);
    }
}

const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
    const xValue = d => d.hours;
    const margin = {top: 50, left: 50, right: 50, bottom: 50};

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([height - margin.bottom, margin.top]);

    const xScale = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const g = svg.append('g');

    g.append('g').call(d3.axisLeft(yScale).ticks(null, data.format))
        .attr('transform', `translate(${margin.left}, 0)`);
    g.append('g').call(d3.axisBottom(xScale).tickFormat(i => data[i].date))
        .attr('transform', `translate(0, ${height - margin.bottom})`);

    g.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d, i) => xScale(i))
        .attr('y', d => yScale(d.hours))
        .attr('height', d => yScale(0) - yScale(d.hours))
        .attr('width', xScale.bandwidth())
}

getDataToDisplay()
