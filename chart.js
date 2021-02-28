
const url = new URL(window.location.href);
console.log("classroomID: "+ url.searchParams.get('classroomID'));
console.log("studentName: " + url.searchParams.get('studentName'));
//之後圖片載入要用非同步!不然一定完蛋
$.ajax({
    type:"POST",
    contentType: 'application/json',
    dataType: "json",
    url: "https://concern-backendserver.herokuapp.com/api/teacher/getPersonConcernDiagram",
    data: JSON.stringify({
    "classroomID": url.searchParams.get('classroomID'),
    "studentName": url.searchParams.get('studentName'),
    "timeSpacing":100
    }),
    success: function (msg) {
        console.log(msg);
        drawChart(msg);
    },
    error: function(error){
    console.log(error)
    }
});
google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);


function drawChart(results) {
    if(results==undefined){
        return
    }
    var json_data=results;
    var dataTable=[];
    var Header= ['時間', '專注度'];
    dataTable.push(Header);
    for (var i = 0; i < json_data.timeLineArray.length; i++) {
        var temp=[];
        temp.push(json_data.timeLineArray[i]);
        if(json_data.concernArray[i]>0.8)
          json_data.concernArray[i]=1;
        else if (json_data.concernArray[i]<0.8&&json_data.concernArray[i]>0.5)
          json_data.concernArray[i]=0.5;
        else
          json_data.concernArray[i]=0;
        temp.push(json_data.concernArray[i]);
        dataTable.push(temp);
     }
    var data = new google.visualization.arrayToDataTable(dataTable);
    var view = new google.visualization.DataView(data);
  var options = {
    title: results.studentName+"的專注度統計",
    width: '1200px',
    height: '400px',
    backgroundColor: "white",
    legend: { position: "none" },
    titleTextStyle: {
      color: "black",
      fontSize: 20,
      bold: true,
    },
    hAxis: {
      title: "時間",
      textStyle: {
        color: "black",
        fontSize: 12,
        bold: true
      },
      gridlines: {
        color: "#BEBEBE"
      },
      baselineColor: "#BEBEBE"
    },
    vAxis: {
      title: "專注度",
      textStyle: {
        color: "black",
        fontSize: 16,
        bold: true
        },
        gridlines: {
            color: "#BEBEBE"
        },
        baselineColor: "#BEBEBE",
        viewWindow:{
            max:1,
            min:-0.2
        },
        ticks: [{v:1, f:'專心'}, {v:0.5, f:'普通'},{v:0, f:'不專心'},{v:-0.2, f:''}]
    },
    series: {
        0: {
            areaOpacity: 0,
            lineWidth: 4
        }
    }
  };
  var chart = new google.visualization.SteppedAreaChart(document.getElementById("SteppedAreachart_values_personal"));
//   chart.draw(view, options);
    google.visualization.events.addListener(chart, 'ready', function () {
        var imgUri = chart.getImageURI();
        $('button').css('display', 'block');
        $('#loading').css('display', 'none');
        var a = document.getElementById("download");
        a.href = imgUri;
        a.download = results.studentName+"的專注度統計";
        // a.click(); //要和按鈕融合
    });
    chart.draw(view, options);
}