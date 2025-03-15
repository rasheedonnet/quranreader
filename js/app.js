window.onload = function(){
    
    const surahJson = 'data/surah.json';

    let surahSelect = $('#surah-list');
    let ayahStart = $('#ayah-start');
    let ayahEnd = $('#ayah-end');
    let recitation = $('#list-recitation');
    let translation = $('#list-translation');
    let playProgress = $('#playProgress');
    let playBtn = $('#playBtn');
    let audioToggle = $('#audioToggle');
    let translationToggle = $('#translationToggle');
    var myAudio = document.getElementById('player');
    var playlist = new Array();

    initializePage();

    // This is replaced by the new implementation below
    
    resetBtnClick = function() { 
        location.reload();
    }

    function initializePage(){
        // Make sure the Play button starts with "Play" text
        playBtn.html('<i class="fas fa-play mr-2"></i>Play');
        
        surahSelect.empty();
        surahSelect.append('<option disabled>Select Surah</option>');
        ayahStart.empty();
        ayahEnd.empty();
        // Populate dropdown with list of suras
        $.getJSON(surahJson, function (data) {
            $.each(data.quran.suras.sura, function (key, entry) {
                var displaySurah = entry.index + '.' + entry.tname + ' (' + entry.name + ')';
                var selected = (entry.index == 1) ? 'selected' : '';
                surahSelect.append($('<option ' + selected + '></option>').attr('value', entry.index).text(displaySurah));
            });
            
            // Set the initialLoadComplete flag to false to prevent auto-playback
            window.initialLoadComplete = false;
            
            // Trigger change event to load ayahs for the first surah
            surahSelect.trigger('change');
        });
    }

    
    // Function to automatically play when selections change
    function startPlayback() {
        // Reset and stop any current playback
        if (playBtn.text().includes('Stop')) {
            myAudio.pause();
        }
        
        // Start playing the new selection
        playlist = createPlaylist();
        if (playlist.length > 0) {
            var audioSourceBaseUrl = 'https://everyayah.com/data/';
            playBtn.html('<i class="fas fa-stop mr-2"></i>Stop');
            i = 0;
            
            // Store current track index in a global variable
            window.currentTrackIndex = 0;
            
            // Remove previous ended event handlers to avoid duplicates
            myAudio.removeEventListener('ended', playNextAyah);
            
            // Add the event listener for continuous playback
            myAudio.addEventListener('ended', playNextAyah, true);
            
            myAudio.loop = false;
            myAudio.src = audioSourceBaseUrl + playlist[0];
            playProgress.text("Playing ayah: " + playlist[0].split('/').pop().substring(3,6));
            playProgress.show();
            myAudio.play();
        }
    }
    
    // Event handler for the ended event
    function playNextAyah() {
        i = ++i;
        window.currentTrackIndex = i;
        var audioSourceBaseUrl = 'https://everyayah.com/data/';
        
        if(i == playlist.length){
            myAudio.pause();
            playBtn.html('<i class="fas fa-play mr-2"></i>Play');
            playProgress.text("");
            return;
        }
        else{
            playProgress.text("Playing ayah: " + playlist[i].split('/').pop().substring(3,6));
            playProgress.show();
        }
        myAudio.src = audioSourceBaseUrl + playlist[i];
        myAudio.play();
    }

    // Update the Play button function to use the shared playback logic
    playBtnClick = function() {
        if (playBtn.text().includes('Play')) {
            // If playlist exists and we're just paused, resume playback
            if (playlist.length > 0 && myAudio.paused && myAudio.src) {
                playBtn.html('<i class="fas fa-stop mr-2"></i>Stop');
                myAudio.play();
            } else {
                // Otherwise start new playback
                startPlayback();
            }
        } else {
            // Pause the audio but maintain current position
            playBtn.html('<i class="fas fa-play mr-2"></i>Play');  
            myAudio.pause();
        }
    }

    // Handle surah selection change
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
            });
            
            // Create playlist and start playback on surah change
            playlist = createPlaylist();
            
            // Only start playback if this isn't the initial page load
            if (window.initialLoadComplete) {
                startPlayback();
                // Make sure Play button shows Stop
                playBtn.html('<i class="fas fa-stop mr-2"></i>Stop');
            }
        });
    });
    
    // Set flag after initial load is complete
    $(document).ready(function() {
        // Short delay to ensure page is fully loaded before enabling auto-play
        setTimeout(function() {
            window.initialLoadComplete = true;
        }, 500);
    });
    
    // Handle ayah start selection change
    ayahStart.change(function() {
        // Ensure end ayah is never less than start ayah
        if (parseInt(ayahEnd.val()) < parseInt(ayahStart.val())) {
            ayahEnd.val(ayahStart.val());
        }
        
        // Update playlist and start playback
        playlist = createPlaylist();
        startPlayback();
        // Make sure Play button shows Stop
        playBtn.html('<i class="fas fa-stop mr-2"></i>Stop');
    });
    
    // Handle ayah end selection change
    ayahEnd.change(function() {
        // Update playlist and start playback
        playlist = createPlaylist();
        startPlayback();
        // Make sure Play button shows Stop
        playBtn.html('<i class="fas fa-stop mr-2"></i>Stop');
    });
    
    // Handle recitation change
    recitation.change(function() {
        // Update playlist and start playback
        playlist = createPlaylist();
        startPlayback();
        // Make sure Play button shows Stop
        playBtn.html('<i class="fas fa-stop mr-2"></i>Stop');
    });
    
    // Handle translation change
    translation.change(function() {
        // Update playlist and start playback
        playlist = createPlaylist();
        startPlayback();
        // Make sure Play button shows Stop
        playBtn.html('<i class="fas fa-stop mr-2"></i>Stop');
    });
    
    // Handle audio toggle change
    audioToggle.change(function() {
        // Update playlist and start playback
        playlist = createPlaylist();
        startPlayback();
        // Make sure Play button shows Stop
        playBtn.html('<i class="fas fa-stop mr-2"></i>Stop');
    });
    
    // Handle translation toggle change
    translationToggle.change(function() {
        // Update playlist and start playback
        playlist = createPlaylist();
        startPlayback();
        // Make sure Play button shows Stop
        playBtn.html('<i class="fas fa-stop mr-2"></i>Stop');
    });

    function createPlaylist()
    {
        var awudhuBillah = '001000.mp3';
        var bismillah = '001001.mp3';
        var niyath = [];
        var isAudioEnabled = audioToggle.prop('checked');
        var isTranslationEnabled = translationToggle.prop('checked');
        
        //var ayas = new Array(awudhuBillah, bismillah);
        var ayas = new Array();
        
        if(isAudioEnabled) {
            ayas.push(recitation.val() + "/" + awudhuBillah)
            if(surahSelect.val()!="1"){
                ayas.push(recitation.val() + "/" + bismillah)
            }
        }
        
        for (i=parseInt(ayahStart.val()); i<=parseInt(ayahEnd.val()); i++){
            if(isAudioEnabled) {
                ayas.push(recitation.val() + "/" + prependZero(surahSelect.val()) + prependZero(i) + '.mp3')
            }
            if(isTranslationEnabled) {
                ayas.push(translation.val() + "/" + prependZero(surahSelect.val()) + prependZero(i) + '.mp3')
            }
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