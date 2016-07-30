'use strict';

angular.module('confusionApp')

.controller('MenuController', ['$scope', 'menuFactory', 'favFactory', 'ngNotify',
    'AuthFactory',
    function($scope, menuFactory, favFactory, ngNotify, AuthFactory) {
        $scope.tab = 1;
        $scope.showDetails = false;
        $scope.showFavBtn = false;
        $scope.loggedIn = false;
        $scope.filtText = '';
        $scope.showMenu = false;
        $scope.message = "Loading ...";
        menuFactory.query(
            function(response) {
                $scope.dishes = response;
                $scope.showMenu = true;
            },
            function(response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

        $scope.select = function(setTab) {
            $scope.tab = setTab;
            if (setTab === 2) {
                $scope.filtText = "appetizer";
            } else if (setTab === 3) {
                $scope.filtText = "mains";
            } else if (setTab === 4) {
                $scope.filtText = "dessert";
            } else {
                $scope.filtText = "";
            }
        };
        $scope.isSelected = function(checkTab) {
            return ($scope.tab === checkTab);
        };
        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };
        $scope.toggleFav = function() {
            $scope.showFavBtn = !$scope.showFavBtn;
        };
        $scope.addToFav = function(dishId) {

            favFactory.save({
                _id: dishId
            })
                .$promise.then(
                    function(response) {
                        $scope.exist = response.exist;
                        if (!$scope.exist) {
                            ngNotify.set('Dish added to favorite list!', 'grimace');

                        } else {
                            ngNotify.set('Dish is already in favorite list!', 'error');
                        }
                    },
                    function(response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
            );

        };
        if (AuthFactory.isAuthenticated()) {
            $scope.loggedIn = true;
        };
    }
])


.controller('ContactController', ['$scope', 'feedbackFactory', '$localStorage',
    'AuthFactory', 'ngNotify',
    function($scope, feedbackFactory, $localStorage, AuthFactory, ngNotify) {

        $scope.fullName = '';
        $scope.loggedIn = false;
        if (AuthFactory.isAuthenticated()) {
            $scope.fullName = $localStorage.getObject('fullname', '{}');
            $scope.loggedIn = true;
        }
        $scope.feedback = {
            mychannel: "",
            agree: false,
            email: ""
        };

        var channels = [{
            value: "tel",
            label: "Tel."
        }, {
            value: "Email",
            label: "Email"
        }];
        $scope.channels = channels;
        $scope.invalidChannelSelection = false;

        $scope.sendFeedback = function() {

            if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            } else {
                feedbackFactory.save($scope.feedback);
                console.log($scope.feedback);
                $scope.invalidChannelSelection = false;
                $scope.feedback = {
                    mychannel: "",
                    agree: false,
                    email: ""
                };
                $scope.feedbackForm.$setPristine();
            }
            ngNotify.set('Thank you for your Feedback');
        };

    }
])


.controller('DishDetailController', ['$scope', '$state', '$stateParams', 'menuFactory',
    'commentFactory', '$localStorage', 'AuthFactory', 'ngNotify',
    function($scope, $state, $stateParams, menuFactory, commentFactory, $localStorage,
        AuthFactory, ngNotify) {

        $scope.fullName = '';
        $scope.loggedIn = false;
        if (AuthFactory.isAuthenticated()) {
            $scope.fullName = $localStorage.getObject('fullname', '{}');
            $scope.loggedIn = true;
        }
        $scope.showDish = false;
        $scope.message = "Loading ...";
        $scope.dish = menuFactory.get({
            id: $stateParams.id
        })
            .$promise.then(
                function(response) {
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
        );
        $scope.comment = {
            rating: 5,
            comment: ""
        };
        $scope.submitComment = function() {

            commentFactory.save({
                id: $stateParams.id
            }, $scope.comment)

            .$promise.then(
                function(response) {
                    $scope.comment.createdAt = new Date();
                    $scope.comment.postedBy = {
                        firstname: $scope.fullName.firstname,
                        lastname: $scope.fullName.lastname
                    };
                    $scope.dish.comments.push($scope.comment);
                    $scope.commentForm.$setPristine();
                    $scope.comment = {
                        rating: 5,
                        comment: ""
                    };
                },
                function(response) {
                    ngNotify.set('Server error , comment has not been submited', 'error');

                }
            );


        };

    }
])





.controller('HomeController', ['$scope', 'menuFactory', 'corporateFactory',
    'promoFactory',
    function($scope, menuFactory, corporateFactory, promoFactory) {

        $scope.message = "Loading ...";
        $scope.showDish = false;
        var dishes = menuFactory.query({
                featured: "true"
            })
            .$promise.then(
                function(response) {
                    dishes = response;
                    $scope.dish = dishes[0];
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

        $scope.showPromo = false;
        var promotions = promoFactory.query({
                featured: "true"
            })
            .$promise.then(
                function(response) {
                    promotions = response;
                    $scope.promo = promotions[0];
                    $scope.showPromo = true;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

        $scope.showLeaders = false;
        var leaders = corporateFactory.query({
                featured: "true"
            })
            .$promise.then(
                function(response) {
                    leaders = response;
                    $scope.leader = leaders[0];
                    $scope.showLeaders = true;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

    }
])


.controller('AboutController', ['$scope', 'corporateFactory',
    function($scope, corporateFactory) {

        $scope.showLeaders = false;
        $scope.message = "Loading ...";
        $scope.leaders = corporateFactory.query(
            function(response) {
                $scope.leaders = response;
                $scope.showLeaders = true;
            },
            function(response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

    }
])

.controller('FavController', ['$scope', '$state', 'favFactory', 'AuthFactory',

    function($scope, $state, favFactory, AuthFactory) {

        $scope.tab = 1;
        $scope.showDetails = false;
        $scope.showFavBtn = false;
        $scope.filtText = '';
        $scope.showMenu = false;
        $scope.message = "Loading ...";
        favFactory.query(
            function(response) {
                $scope.dishes = response.dishes;
                $scope.showMenu = true;
            },
            function(response) {
                if (!AuthFactory.isAuthenticated()) {
                    $scope.message = "You have to be a user to have favorite list";
                } else {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            });

        $scope.select = function(setTab) {
            $scope.tab = setTab;
            if (setTab === 2) {
                $scope.filtText = "appetizer";
            } else if (setTab === 3) {
                $scope.filtText = "mains";
            } else if (setTab === 4) {
                $scope.filtText = "dessert";
            } else {
                $scope.filtText = "";
            }
        };
        $scope.isSelected = function(checkTab) {
            return ($scope.tab === checkTab);
        };
        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };
        $scope.toggleDeleteFav = function() {
            $scope.ShowDelBtn = !$scope.ShowDelBtn;
        };
        $scope.delFavDish = function(dishId) {
            favFactory.delete({
                id: dishId
            });
            $state.go($state.current, {}, {
                reload: true
            });

        };
    }
])

.controller('HeaderController', ['$scope', '$state', '$rootScope',
    'ngDialog', 'AuthFactory', 'ngNotify',
    function($scope, $state, $rootScope, ngDialog, AuthFactory, ngNotify) {

        $scope.loggedIn = false;
        $scope.username = '';

        if (AuthFactory.isAuthenticated()) {
            $scope.loggedIn = true;
            $scope.username = AuthFactory.getUsername();
        }

        $scope.openLogin = function() {
            ngDialog.open({
                template: 'views/login.html',
                scope: $scope,
                className: 'ngdialog-theme-default',
                controller: "LoginController"
            });
        };

        $scope.logOut = function() {
            AuthFactory.logout();
            $scope.loggedIn = false;
            $scope.username = '';
            $state.go($state.current, {}, {
                reload: true
            });
            ngNotify.set('You have successfully logged out!');
        };

        $rootScope.$on('login:Successful', function() {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
            $state.go($state.current, {}, {
                reload: true
            });
            ngNotify.set('You have successfully logged in!', 'success');
        });

        $rootScope.$on('registration:Successful', function() {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

        $scope.stateis = function(curstate) {
            return $state.is(curstate);
        };

    }
])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory',
    function($scope, ngDialog, $localStorage, AuthFactory) {

        $scope.loginData = $localStorage.getObject('userinfo', '{}');

        $scope.doLogin = function() {
            if ($scope.rememberMe) {
                $localStorage.storeObject('userinfo', $scope.loginData);
            }

            AuthFactory.login($scope.loginData);

            ngDialog.close();
        };

        $scope.openRegister = function() {
            // ngDialog.close(); //close login dialog
            ngDialog.open({
                template: 'views/register.html',
                scope: $scope,
                className: 'ngdialog-theme-default',
                controller: "RegisterController"
            });
        };

    }
])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory',
    function($scope, ngDialog, $localStorage, AuthFactory) {

        $scope.register = {};
        $scope.loginData = {};

        $scope.doRegister = function() {
            console.log('Doing registration', $scope.registration);

            AuthFactory.register($scope.registration);

            ngDialog.close();
        };
        $scope.closeThisDialog = function() {
            ngDialog.close();
        };
    }
])

;