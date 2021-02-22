var camera_utils_script = document.createElement('script');
camera_utils_script.setAttribute('src','https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
camera_utils_script.setAttribute('crossorigin','anonymous');
document.head.appendChild(camera_utils_script);

var control_utils_script = document.createElement('script');
control_utils_script.setAttribute('src','https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js');
control_utils_script.setAttribute('crossorigin','anonymous');
document.head.appendChild(control_utils_script);

var drawing_utils_script = document.createElement('script');
drawing_utils_script.setAttribute('src','https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
drawing_utils_script.setAttribute('crossorigin','anonymous');
document.head.appendChild(drawing_utils_script);

var face_mesh_script = document.createElement('script');
face_mesh_script.setAttribute('src','https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');
face_mesh_script.setAttribute('crossorigin','anonymous');
document.head.appendChild(face_mesh_script);

var axios = document.createElement('script');
axios.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js');
axios.setAttribute('crossorigin','anonymous');
document.head.appendChild(axios);


var jquery = document.createElement('script');
jquery.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js');
jquery.setAttribute('crossorigin','anonymous');
document.head.appendChild(jquery);

var body=document.getElementsByTagName('body')[0];
const onMessage = (message) => {
  switch (message.action) {
    case 'START':
      start(message.name,message.studentID);
      break;
    default:
      break;
  }
}
var newCanvas = document.createElement('canvas');
newCanvas.setAttribute("id", "newCanvas");
// body.appendChild(newCanvas);

var context = newCanvas.getContext('2d');
var video;
chrome.runtime.onMessage.addListener(onMessage);



var insert_script = document.createElement("script");



function start(name,studentID){
  if(name == '' || studentID == ''){
    alert("請填入Google Meet名字和學號");
  }
  else{
    console.log("開始上課");
    //   console.log("name"+name);
    //   console.log("studentID"+studentID);


    //抓各個視頻的名字
    // var student_everyone=document.querySelectorAll(".YBp7jf")
    // student_everyone.forEach(function(student){
    //     if(student.innerHTML=="你"){
    //       console.log("名字"+name+"學號"+studentID);
    //       //抓視頻
    //       // console.log("student.parentElement"+student.parentElement.nextElementSibling.nextElementSibling.firstElementChild);
    //       // video = document.querySelector(".p2hjYe").firstElementChild;
    //       video = student.parentElement.nextElementSibling.nextElementSibling.firstElementChild;
    //       video.parentElement.parentElement.style.boxSizing = "border-box";
    //       //   console.log("video.getAttribute(attributeName) "+video.getAttribute("data-uid"));
    //       newCanvas.width = parseInt(video.parentElement.style.width);
    //       newCanvas.height = parseInt(video.parentElement.style.height);
    //       newCanvas.style.display='none';
    //       // waitSeconds()
    //       // chrome.runtime.sendMessage({'video': 'HI'}, function(response) {console.log("回應"+response)});

    //     }
    // });
    const url = window.location.pathname.substr(1);
    console.log(url);
    $.ajax({
        type:"POST",
        contentType: 'application/json',
        dataType: "json",
        url: "https://concern-backendserver.herokuapp.com/api/student/startClass",
        data: JSON.stringify({
          "classroomID": url,
          "studentName": name,
        }),
        success: function() {
            console.log("成功");
        },
        error: function(XMLHttpRequest){
          console.log(XMLHttpRequest.responseText);
        }
    });
    body.appendChild(newCanvas);
    insert_script.innerHTML =
    'var name_meet;'+
    'var studentID_meet;'+
    'window.addEventListener("message",function(me) {  '+
      'name_meet=me.data.name;'+
      'studentID_meet=me.data.studentID;'+
      'console.log("學生姓名和學號: " + me.data.studentID+me.data.name);'+
    '});  '+

    

    'var newCanvas = document.getElementById("newCanvas");'+
    'var context = newCanvas.getContext("2d");'+
    'var video;'+

    'var eyes_criticalRatio = 0.8, mouth_criticalRatio = 1.2;'+
    'var eyes_average = 0, mouth_average = 0;'+
    'var concernValue = 0.0;'+


    'var student_everyone=document.querySelectorAll(".YBp7jf");'+
    'student_everyone.forEach(function(student){'+
        'if(student.innerHTML=="你"){'+
          'console.log("student.parentElement"+student.parentElement.nextElementSibling.nextElementSibling.firstElementChild);'+
          'video = student.parentElement.nextElementSibling.nextElementSibling.firstElementChild;'+
          'video.parentElement.parentElement.style.boxSizing = "border-box";'+
          'newCanvas.width = parseInt(video.parentElement.style.width);'+
          'newCanvas.height = parseInt(video.parentElement.style.height);'+
          'newCanvas.style.display="none";'+

          'waitSeconds();'+
          'setTimeout(send,100);'+

        '}'+
    '});'+

    'function waitSeconds(){'+
      'const camera = new Camera(video, {'+
        'onFrame: async () => {'+
            'await faceMesh.send({ image: video });'+
        '},'+
        'width: newCanvas.width,'+
        'height: newCanvas.height'+
      '});'+
      'camera.start();'+
      'const faceMesh = new FaceMesh({'+
        'locateFile: (file) => {'+
            'return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;'+
        '}'+
      '});'+
      'faceMesh.setOptions({'+
          'maxNumFaces: 1,'+
          'minDetectionConfidence: 0.5,'+
          'minTrackingConfidence: 0.5'+
      '});'+
      'faceMesh.onResults(onResults);'+
      
    '}'+

    'function onResults(results) {'+
      'context.save();'+
      'context.clearRect(0, 0, newCanvas.width, newCanvas.height);'+
      'context.drawImage('+
          'results.image, 0, 0, newCanvas.width, newCanvas.height);'+
      'if (results.multiFaceLandmarks) {'+
          'for (const landmarks of results.multiFaceLandmarks) {'+
              'drawConnectors(context, landmarks, FACEMESH_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });'+
              'drawConnectors(context, landmarks, FACEMESH_RIGHT_EYE, { color: "#FF3030" });'+
              'drawConnectors(context, landmarks, FACEMESH_RIGHT_EYEBROW, { color: "#FF3030" });'+
              'drawConnectors(context, landmarks, FACEMESH_LEFT_EYE, { color: "#30FF30" });'+
              'drawConnectors(context, landmarks, FACEMESH_LEFT_EYEBROW, { color: "#30FF30" });'+
              'drawConnectors(context, landmarks, FACEMESH_FACE_OVAL, { color: "#E0E0E0" });'+
              'drawConnectors(context, landmarks, FACEMESH_LIPS, { color: "#E0E0E0" });'+
          '}'+
      '}'+
      'context.restore();'+
      'if (results.multiFaceLandmarks) {'+
          'var righteye_ratio = CalcDotsDistance(results, 145, 159) / CalcDotsDistance(results, 33, 133);'+
          'var lefteye_ratio = CalcDotsDistance(results, 374, 386) / CalcDotsDistance(results, 263, 362);'+
          'var mouth_ratio = CalcDotsDistance(results, 13, 14) / CalcDotsDistance(results, 308, 78);'+
  
          'Average_judgify(results, (righteye_ratio + lefteye_ratio) / 2, mouth_ratio);'+
          'valueJudgment((righteye_ratio + lefteye_ratio) / 2, mouth_ratio);'+
      '}'+
      'else {'+
          'console.log("No Face");'+
          'concernValue =0.0;'+
          'addborder();'+
          
      '}'+
    '}'+

    'function valueJudgment(value_eye, value_mouth) {'+
      'value_eye = value_eye / eyes_average;'+
      'value_mouth = value_mouth / mouth_average;'+
  
      'valueJudgment2(value_eye, value_mouth);'+
    '}'+
  
    'var timer_eye = 0.0, timer_mouth = 0.0;'+
    'var time_criticalValue = 3000;'+
    'var isTimeCounting_eye = false, isTimeCounting_mouth = false;'+
    'var overTimeLimit_eye = false, overTimeLimit_mouth = false;'+
    'function valueJudgment2(value_eye, value_mouth) {'+
      'if (value_eye >= eyes_criticalRatio) {'+
          'isTimeCounting_eye = false;'+
          'overTimeLimit_eye = false;'+
      '}'+
      'else if (value_eye < eyes_criticalRatio * eyes_average) {'+
          'if (isTimeCounting_eye === false) {'+
              'timer_eye = Date.now() + time_criticalValue;'+
              'isTimeCounting_eye = true;'+
          '}'+
          'else {'+
              'if (Date.now() > timer_eye) {'+
                  'overTimeLimit_eye = true;'+
              '}'+
          '}'+
          'if (overTimeLimit_eye === false) value_eye = eyes_criticalRatio;'+
      '}'+
      'if (value_mouth <= mouth_criticalRatio * mouth_average) {'+
          'isTimeCounting_mouth = false;'+
          'overTimeLimit_mouth = false;'+
      '}'+
      'else if (value_mouth > mouth_criticalRatio) {'+
          'if (isTimeCounting_mouth === false) {'+
              'timer_mouth = Date.now() + time_criticalValue;'+
              'isTimeCounting_mouth = true;'+
          '}'+
          'else {'+
              'if (Date.now() > timer_mouth) {'+
                  'overTimeLimit_mouth = true;'+
              '}'+
          '}'+
          'if (overTimeLimit_mouth === false) value_mouth = mouth_criticalRatio;'+
      '}'+
      'valueAverager(value_eye, value_mouth);'+
    '}'+
    'var calcFreq = 4;'+
    'var valueCounter = 0; var eyes_sum = 0.0, mouth_sum = 0.0;'+
    'function valueAverager(value_eyes, value_mouth) {'+

        'valueCounter += 1;'+

        'eyes_sum += value_eyes;'+
        'mouth_sum += value_mouth;'+

        'if (valueCounter >= calcFreq) {'+
            'var eyes_value = eyes_sum / valueCounter;'+
            'var mouth_value = mouth_sum / valueCounter;'+
            'valueCounter = 0;'+
            'eyes_sum = 0; mouth_sum = 0;'+

            'valueCalculator(eyes_value, mouth_value);'+
        '}'+
    '}'+

    'var weight_eyes = 0.7, weight_mouth = 0.3;'+
    'function valueCalculator(value_eye, value_mouth) {'+
        'concernValue = value_eye * weight_eyes + (2 - value_mouth) * weight_mouth;'+
  
        'addborder();'+
        


    '}'+

    'function CalcDotsDistance(results, A, B) {'+
      'var distance = Math.sqrt(Math.pow((results.multiFaceLandmarks[0][A].x - results.multiFaceLandmarks[0][B].x), 2) + Math.pow((results.multiFaceLandmarks[0][A].y - results.multiFaceLandmarks[0][B].y), 2));'+
      'return distance;'+
    '}'+

    'var dataCount = 0;'+
    'var dataMax = 50;'+
    'var eyeDistance_average = 0;'+

    'function Average_judgify(results, eyesValue, mouthValue) {'+
      'if (dataCount < dataMax) {'+
          'eyes_average = eyes_average * (dataCount / (dataCount + 1)) + eyesValue / (dataCount + 1);'+
          'mouth_average = mouth_average * (dataCount / (dataCount + 1)) + mouthValue / (dataCount + 1);'+

          'eyeDistance_average = eyeDistance_average  * (dataCount / (dataCount + 1)) + CalcDotsDistance(results, 243, 463) / (dataCount + 1);'+
          'dataCount += 1;'+
      '}'+
      'else'+
      '{'+
          'var newEyeDistance = CalcDotsDistance(results, 243, 463);'+
          'if(newEyeDistance < 0.85 * eyeDistance_average || newEyeDistance > 1.15 * eyeDistance_average)'+
          '{'+
              'dataCount = 0;'+
          '}'+
      '}'+
    '}'+
  
    'function addborder(){'+  
      'var color_str=concernValue;'+
      'console.log(color_str+video.getAttribute("data-uid"));'+
      'if(color_str !="No Face"){'+
        'if(color_str<0.5){'+
          'video.parentElement.parentElement.style.border="6px solid red";'+
        '}'+
        'else if(color_str>0.5&&color_str<0.8){'+
          'video.parentElement.parentElement.style.border="6px solid yellow";'+
        '}'+
        'else if(color_str>0.8){'+
          'video.parentElement.parentElement.style.border="6px solid green";'+
        '}'+
      '}'+
      'else{'+
        'video.parentElement.parentElement.style.border="6px solid red";'+
      '}'+
    '}'+

    'function send(){'+
      'const url = window.location.pathname.substr(1);'+
      'var today=new Date();'+
      'var currentDateTime =today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();'+
      '$.ajax({'+
        'type:"PUT",'+
        'url: "https://concern-backendserver.herokuapp.com/api/student/update",'+
        'data: {'+
          '"classroomID":url,'+
          '"studentName": name_meet,'+
          '"concernDegree": concernValue,'+
          '"time": currentDateTime'+
        '},'+
        'success: function() {'+
            'console.log(concernValue);'+
            'setTimeout(send,100);'+
        '},'+
        'error: function(XMLHttpRequest, textStatus, errorThrown){'+
          'console.log(XMLHttpRequest.responseText);'+
          'setTimeout(send,100);'+
        '}'+
      '});'+
    '}';
  
    body.appendChild(insert_script);
    window.postMessage({name:name,studentID:studentID});
  }  
}




// function waitSeconds(){
    // video.style.border="transparent 6px solid"
    // window.setInterval("drawPicture()",5000);
    // console.log("name:"+name);
// }





// // Trigger photo take
// var drawPicture=()=>{
//     context.drawImage(video, 0, 0, parseInt(video.parentElement.style.width), parseInt(video.parentElement.style.height));
//     let imgData = context.getImageData( 0, 0,parseInt(video.parentElement.style.width), parseInt(video.parentElement.style.height));
//     let pixels = imgData.data;
//     for (var i = 0; i < pixels.length; i += 4) {

//     let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);

//     pixels[i] = lightness;
//     pixels[i + 1] = lightness;
//     pixels[i + 2] = lightness;
//   }
//     context.putImageData(imgData, 0, 0);
//     document.body.appendChild(newCanvas);
//     var dataURL = newCanvas.toDataURL("image/jpeg",1);
//     // console.log(dataURL);
//     fetch(dataURL)
//         .then(async(response)=>{
//             const file = await response.blob();
//                 let formData = new FormData();
//                 formData.append("file", file); 

//                     return axios({
//                         method: 'POST',
//                         url: 'https://concern-server-2020.herokuapp.com/upload',
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         },
//                         data: formData,
//                     })

//         })
//         .then((response) => {
//             console.log(response.data)
//             addborder(response.data)
//             send(response.data)
//         })
//         function send(number){
//           $.ajax({
//             type:"GET",
//             dataType: "jsonp",
//             jsonp: "callback", //Jquery生成驗證引數的名稱
//             // a/grad.ntue.edu.tw/
//             url: "https://script.google.com/a/grad.ntue.edu.tw/macros/s/AKfycby8KOoQDDk421wDDhiUjoDBRMJGCu8BGX6B_519cW-b3uF610ww/exec?prefix=calltest",
//             data: {
//               "name": name,
//               "number": number
//             },
//             success: function() {
//                 alert("成功")
//             },
//             error: function(){
//               alert("失敗！")
//             }
//           });
//         }
// };

// function addborder(color_str){
//     if(color_str !="No Face"){
//         const color = parseFloat(color_str)
//         if(color<0.4){
//             video.parentElement.parentElement.style.border="6px solid red";
//             // document.querySelector(".koV58").style.border="6px solid red";

//         }
//         else if(color>0.4&&color<0.65){
//             video.parentElement.parentElement.style.border="6px solid yellow";
//             // document.querySelector(".koV58").style.border="6px solid yellow";

//         }
//         else if(color>0.65){
//             video.parentElement.parentElement.style.border="6px solid green";
//             // document.querySelector(".koV58").style.border="6px solid green";
//         }
//     }
//     else{
//         // alert("No Face")
//         video.parentElement.parentElement.style.border="6px solid red";

//     }
// }







