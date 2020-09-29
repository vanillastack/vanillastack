$(document).ready(function() {

    console.log("Starting check!");

    // Set up a timer checking for the installer to be present
    (function(){
        var timer;

        function transition(){
            clearTimeout(timer);
            $.ajax({url: "http://localhost:8080",
                    type: "HEAD",
                    timeout:500,
                    statusCode: {
                        200: function (response) {
                            console.log("Reachable!");
                            window.location.replace('http://localhost:8080');
                        },
                        0: function (response) {
                            console.log("Not reachable!");
                            restart();
                        }
                    }
            })

            function restart() {
                timer = setTimeout(transition, 2000);
            }
        }
        transition();
 })();
});