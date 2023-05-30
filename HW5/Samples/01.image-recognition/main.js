$(document).ready(function(){
    //do something
    $("#thisButton").click(function(){
        processImage();
    });
});

function processImage() {
    
    //確認區域與所選擇的相同或使用客製化端點網址
    var url = "https://eastus.api.cognitive.microsoft.com/";
    var uriBase = url + "vision/v2.1/describe";
    
    var params = {
        // "visualFeatures": "Faces,Brands,Adult,Categories,Description,Color",
        // "details": "",
        "maxCandidates":"10",
        "language": "zh",
    };
    //顯示分析的圖片
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;
    //送出分析
    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request header
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        // Request body
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    .done(function(data) {
        //顯示JSON內容
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        $("#picDescription").empty();
        // for (var x = 0; x < data.description.captions.length;x++){
        //     $("#picDescription").append(data.description.captions[x].text + "<br>");
        // }
        // 根據可信度排序描述
        var sortedCaptions = data.description.captions.sort(function(a, b) {
            return b.confidence - a.confidence;
        // for (var x = 0; x < data.description.captions.length;x++){
        //     $("#picDescription").append(data.description.captions[x].text + "<br>");
        // }
        });

        // 選擇最有最高可信度的一句話
        var bestCaption = sortedCaptions[0].text;
        $("#picDescription").append("<p style='font-size: 15px;'>依據測試的信心程度，該圖片最具有可信程度的描述為:</p>");//變更字體
        $("#picDescription").append("<p style='font-size: 24px; color: #8B4513'>" + bestCaption + "</p>");//變更字體與顏色
        })
        // $("#picDescription").append("這裡有"+data.faces.length+"個人");
    .fail(function(jqXHR, textStatus, errorThrown) {
        //丟出錯誤訊息
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
};