var App = (function(){

    var ListItemView = function(){
        this.el = $("<li/>");
    }

    var ListView = function(el){
        this.el = $(el);
    }

    ListView.prototype.refreshList = function(studios){ 
        listView = this;
        listView.el.html('');
        listView.el.hide();
    
        $.each(studios,function(i,studio){
            var listItemView = new ListItemView();
            listItemView.el.html(studio.title); 
            listView.el.append(listItemView.el);
        });
    
        listView.el.fadeIn('slow');
    }

	var studiosListView = new ListView(".main ul");	
	var db = localStorage;
	var initialized = false;

	function initialize() {		
		if (!initialized){
			setupDb();
            populateStudiosList( getStudios() );
		}
		initialized = true;
	}

    function db_has_studios_item() {
        return (typeof db.getItem('studios')) != 'undefined';
    }

	function resetDb() {
		db.setItem("studios", JSON.stringify({ studios: [] }));
	}

    function populateStudiosList( studios) {
        studiosListView.refreshList(getStudios().studios);
    }

	function setupDb() {
        if (getStudios().length === 0) {
            db.setItem("studios", JSON.stringify({ 
                studios: [  
                    { id: 1, name: "Yoga Tree" },
                    { id: 2, name: "Black Swan" },
                    { id: 3, name: "Bikram" }
                ]
            }));
        }     
	}

	function getStudios() {
		return JSON.parse(db.getItem("studios"));
	}

	function addStudioToLocalStorage(studio) {
		studios = getStudios();
		studios.studios.push(studio);
		db.setItem("studios", JSON.stringify(studios));
	};

	function sync() { 
		var url = "http://yoga-now-api.herokuapp.com/studios.json"
		$.getJSON(url, function(studios){
			resetDb();

			$.each(studios, function(i, studio){
				addStudioToLocalStorage(studio);
			});

			studiosListView.refreshList(getStudios().studios);
		});	
	}

	function clear() {
		resetDb();
		studiosListView.refreshList(getStudios().studios);
	}

	return {
		initialize: initialize,
		getStudios: getStudios,
		sync: sync,
		resetDb: resetDb,
		clear: clear
	}
})();


