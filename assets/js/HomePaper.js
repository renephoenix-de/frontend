var HomePaper = function () {
    
    this.init = function () {
        $('#front-search-form').submit(function(evt) {
            evt.preventDefault();
            window.location.href = '/ratsdokumente/suche?text=' + encodeURIComponent($('#front-search-text').val());
        });

        var start = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
        var end = new Date();
        var random_seed = '';
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 16; i++) {
            random_seed += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        var params = {
            fq: {
                body: '_all',
                paperType: '_all'
            },
            date: JSON.stringify({
                min: start.toISOString().substr(0, 10),
                max: end.toISOString().substr(0, 10)
            }),
            f: 0,
            s: 5,
            rs: random_seed
        };
        $.post('/api/search', params, function (data) {
            modules.home_paper.process_results(data);
        });
    };

    this.process_results = function (data) {
        var html = '';
        for (var i = 0; i < data.data.length; i++) {
            html += '<div class="home-latest-document">';
            html += '<h4><a href="/paper/' + data.data[i].id + '">' + ((data.data[i].name) ? data.data[i].name : 'Namenloses Dokument') + '</a></h4>';
            html += '<p>';
            html += ((data.data[i].paperType) ? data.data[i].paperType : 'Dokument');
            html += ' vom ' + modules.common.format_datetime(data.data[i].created, 'date') + ' aus ' + data.data[i].body_name;
            html += '</div>';
        }
        $('#home-latest-documents').html(html);
    }
};