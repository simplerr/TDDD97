var chart;

function initChart() {
	
	var options = {
        animation : true,      
    };

    var data = {
    labels: ["Messages sent", "Messages received", "Users Online"],
    datasets: [
        {
            label: "User statistics",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [0, 0, 0]
        }
    ]
	};

	// Get the context of the canvas element we want to select
	var ctx = document.getElementById("chart").getContext("2d");
	chart = new Chart(ctx).Bar(data);

	setInterval(function(){
		// Request data from the database with websockets
		var update_chart = new Object();
		update_chart.id = "update_chart";
		update_chart.token = localStorage.getItem("token");
		ws.send(JSON.stringify(update_chart));
		
		// Updates the bar values
		//myNewChart.datasets[0].bars[0].value = Math.random() * 100;
		//myNewChart.datasets[0].bars[1].value = Math.random() * 100;
		//myNewChart.datasets[0].bars[2].value = Math.random() * 100;
		//myNewChart.update();
	}, 500);
}

function update_chart(sent, received, users) {
	// Updates the bar values
	chart.datasets[0].bars[0].value = sent;
	chart.datasets[0].bars[1].value = received;
	chart.datasets[0].bars[2].value = users;
	chart.update();
}