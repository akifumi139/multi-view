var DeviceList = []
var StreamVideo = []
var SaveVideo = []

var view_cnt = 0
var recorder = Array(view_cnt)
var RecordData = [[]]

var StartButton = document.getElementById('record_button')
var StopButton = document.getElementById('stop_button')
var DownloadButton = document.getElementById('download_button')
var ReloadButton = document.getElementById('reload_button')

var AddButton = document.getElementById("add_button");
var RemoveButton = document.getElementById('remove_button')

var AudioCheckBox = document.getElementById('audio_check')



function getDeviceList(i) {
    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            devices.forEach(function (device) {
                console.log(device.kind + ": " + device.label +
                    " id = " + device.deviceId);
                if (device.kind === 'videoinput') {
                    var id = device.deviceId;
                    console.log(device.deviceId + '★');

                    var option = document.createElement('option');
                    option.setAttribute('value', id);
                    option.innerHTML = 'camera(' + id + ')';
                    DeviceList[i].appendChild(option);
                }

            });
            var option = document.createElement('option');
            option.setAttribute('value', 'desktopCap');
            option.innerHTML = 'DesktopCap';
            DeviceList[i].appendChild(option);
            DeviceList[i].options[0].selected = true;
        })
        .catch(function (err) {
            console.error('enumerateDevide ERROR:', err);
        });

}

function reloadVideo(i) {

    var deviceId = getSelectedVideo(i);
    var constraints = {
        audio: false,
        video: {
            deviceId: deviceId
        }
    };
    if (AudioCheckBox.checked) {
        constraints.audio = true
    }

    console.log('mediaDevice.getMedia():', constraints);

    startView(constraints, i)

    StartButton.disabled = false
}

function getSelectedVideo(i) {
    var id = DeviceList[i].options[DeviceList[i].selectedIndex].value;
    return id;
}

function startView(constraints, i) {
    if (constraints.video.deviceId == 'desktopCap') {
        navigator.mediaDevices.getDisplayMedia(constraints)
            .then(function (stream) {
                videoStream = new MediaStream(stream.getVideoTracks());
                StreamVideo[i].srcObject = videoStream;
                startRecorder(stream, i)
            }).catch(function (error) {
                console.log("navigator.getUserMedia error: ", error);
            });
    } else {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                videoStream = new MediaStream(stream.getVideoTracks());
                StreamVideo[i].srcObject = videoStream;
                startRecorder(stream, i)
            }).catch(function (error) {
                console.log("navigator.getUserMedia error: ", error);
            });
    }
}


function startRecorder(stream, i) {
    //bag can't add metadata
    recorder[i] = new MediaRecorder(stream)
    recorder[i].ondataavailable = function (e) {
        SaveVideo[i].setAttribute('controls', '')
        var outputdata = window.URL.createObjectURL(e.data)
        RecordData[i].push(e.data)
        SaveVideo[i].src = outputdata
    }
}


StartButton.addEventListener('click', function (ev) {
    for (var i = 0; i < view_cnt; i++) {
        SaveVideo[i].src = []
        recorder[i].start()
    }
    DownloadButton.disabled = true
    StartButton.disabled = true
    StopButton.disabled = false
}, false);

StopButton.addEventListener('click', function (ev) {
    for (var i = 0; i < view_cnt; i++) {
        recorder[i].stop()
    }

    StopButton.disabled = true
    DownloadButton.disabled = false
    StartButton.disabled = false
})

DownloadButton.addEventListener('click', function (ev) {
    for (var i = 0; i < view_cnt; i++) {
        var blob = new Blob(RecordData[i], { type: 'video/webm' })
        var url = window.URL.createObjectURL(blob)
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.style = 'display:none'
        a.href = url;
        a.download = 'test' + String(i) + '.webm'
        a.click()
        window.URL.revokeObjectURL(url)
    }
})

ReloadButton.addEventListener('click', function (ev) {
    for (var i = 0; i < view_cnt; i++) {
        reloadVideo(i);
    }
})


AddButton.addEventListener("click", function () {
    view_cnt = view_cnt + 1
    recorder = Array(view_cnt)
    RecordData.push([])

    addView(view_cnt)
    getDeviceList(view_cnt - 1)

    SaveVideo[view_cnt - 1].src = []

    judgView_cnt()

}, false);



RemoveButton.addEventListener("click", function () {
    view_cnt = view_cnt - 1
    recorder = Array(view_cnt)
    RecordData.pop()

    let ViewList = document.getElementById("view_list");

    ViewList.removeChild(ViewList.lastElementChild)

    DeviceList.pop()
    StreamVideo.pop()
    SaveVideo.pop()

    judgView_cnt()

}, false);

function judgView_cnt() {
    if (view_cnt == 0) {
        RemoveButton.disabled = true
        StartButton.disabled = true
    } else {
        RemoveButton.disabled = false
    }
}

function addView(view_cnt) {
    var view = document.createElement('div');
    view.className = 'view';

    view.innerHTML = "deviceID";

    var select = document.createElement('select');
    select.id = 'device_list' + view_cnt;
    select.style = "width:160pt"
    view.appendChild(select)

    var box = document.createElement('div');
    box.className = 'box';
    box.width = 320
    box.height = 240
    view.appendChild(box)

    var device = document.createElement('video');
    device.id = 'device' + view_cnt;
    device.autoplay = 1
    device.controls = 1
    box.appendChild(device)

    var box = document.createElement('div');
    box.className = 'box';
    box.width = 320
    box.height = 240
    view.appendChild(box)

    var video = document.createElement('video');
    video.id = 'video1' + view_cnt;;
    video.autoplay = 1
    box.appendChild(video)

    document.getElementById('view_list').appendChild(view);


    DeviceList.push(document.getElementById(select.id))
    StreamVideo.push(document.getElementById(device.id))
    SaveVideo.push(document.getElementById(video.id))
}