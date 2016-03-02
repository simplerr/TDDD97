function initChart() {
	
	var options = {
        animation : false,
        scaleOverride : false
    };

    var data = {
    labels: ["Messages sent", "Messages received", "Users Online"],
    datasets: [
        {
            label: "User statistics",
            fillColor: "rgba(220,220,220,0.8)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80]
        }
    ]
};

	// Get the context of the canvas element we want to select
	var ctx = document.getElementById("chart").getContext("2d");
	var myNewChart = new Chart(ctx).Bar(data);


}