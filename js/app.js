window.onload = function(){
    
    const surahJson = 'data/surah.json';

    let surahSelect = $('#surah-list');
    let ayahStart = $('#ayah-start');
    let ayahEnd = $('#ayah-end');
    let recitation = $('#list-recitation');
    let translation = $('#list-translation');
    let playProgress = $('#playProgress');
    let playBtn = $('#playBtn');
    var myAudio = document.getElementById('player');
    var playlist = new Array();

    initializePage();

    playBtnClick = function() { 
        var audioSourceBaseUrl = 'https://everyayah.com/data/';

        if (playBtn.text() == 'Play'){
            playBtn.text('Stop');
            if(myAudio.paused && playlist.length > 0){
                myAudio.play();
            }
            else{
                playlist = createPlaylist();
                i = 0;
                myAudio.addEventListener('ended', function () {
                    i = ++i;
                    
                    if(i == playlist.length){
                        myAudio.pause();
                        playBtn.text('Play');
                        playProgress.text("");
                        return;
                    }
                    else{
                        playProgress.text("Playing ayah:" + playlist[i].split('/').pop().substring(3,6));
                    }
                    myAudio.src = audioSourceBaseUrl + playlist[i];
                    
                    myAudio.play();
                }, true);
                myAudio.loop = false;
                myAudio.src = audioSourceBaseUrl + playlist[0];
                myAudio.play();
            }
        }
        else{
            playBtn.text('Play');  
            myAudio.pause();
        }
    }
    
    resetBtnClick = function() { 
        location.reload();
    }

    function initializePage(){
        surahSelect.empty();
        surahSelect.append('<option selected="true" disabled>Select Surah</option>');
        surahSelect.prop('selectedIndex', 0);
        ayahStart.empty();
        ayahEnd.empty();
        // Populate dropdown with list of suras
        $.getJSON(surahJson, function (data) {
            $.each(data.quran.suras.sura, function (key, entry) {
                var displaySurah = entry.index + '.' + entry.tname + ' (' + entry.name + ')';
                surahSelect.append($('<option></option>').attr('value', entry.index).text(displaySurah));
            })
        });
    }

    
    $("#surah-list").change(function() {
        $.getJSON(surahJson, function (data) {
            ayahStart.empty();
            ayahEnd.empty();
            $.each(data.quran.suras.sura, function (key, entry) {
                if(entry.index == $("#surah-list").val()){
                    for(i=1;i<=entry.ayas;i++){
                        ayahStart.append($('<option></option>').attr('value', i).text(i));
                        ayahEnd.append($('<option></option>').attr('value', i).text(i));
                    }
                    ayahEnd.val(entry.ayas);
                }
            })
        });
    });

    function createPlaylist()
    {
        var awudhuBillah = '001000.mp3';
        var bismillah = '001001.mp3';
        var niyath = [];
        
        //var ayas = new Array(awudhuBillah, bismillah);
        var ayas = new Array();
        ayas.push(recitation.val() + "/" + awudhuBillah)
        if(surahSelect.val()!="1"){
            ayas.push(recitation.val() + "/" + bismillah)
        }
        for (i=parseInt(ayahStart.val()); i<=parseInt(ayahEnd.val()); i++){
            ayas.push(recitation.val() + "/" + prependZero(surahSelect.val()) + prependZero(i) + '.mp3')
            ayas.push(translation.val() + "/" + prependZero(surahSelect.val()) + prependZero(i) + '.mp3')
        }
        
        return niyath.concat(ayas);
    }

    function prependZero(number) {
        if (number <= 9){
            return "00" + number;
        }
        else if (number > 9 && number <= 99) {
            return "0" + number;
        } 
        else{
            return number;
        }
    }
}