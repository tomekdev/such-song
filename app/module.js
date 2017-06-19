angular.module('app', ['ngMaterial', 'ngRoute', 'pascalprecht.translate'])
    .config(function ($mdThemingProvider, $translateProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('brown')
            .warnPalette("pink")
            .dark();
        $translateProvider.useStaticFilesLoader({
            prefix: 'resources/translations/locale-',
            suffix: '.json'
        })
            .registerAvailableLanguageKeys(['en','pl'], {
                'en_*': 'en',
                'pl_*': 'pl',
                '*': 'en'
            })
            .determinePreferredLanguage()
            .fallbackLanguage('en');
    });

angular.module('app').directive("suchOnScroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element(element).bind("wheel", function() {
            angular.element(element[0]).stop();
            scope.$apply(attrs.suchOnScroll);
        });
        angular.element(element).bind("touchmove", function() {
            angular.element(element[0]).stop();
            scope.$apply(attrs.suchOnScroll);
        });
    };
});

angular.module('app').directive("suchScrollPercent", function ($window) {
    return function(scope, element, attrs) {
        scope.$watch(attrs.suchScrollPercent, function(value) {
            if (value) {
                var focusPoint = element[0].scrollHeight*value,
                    viewPortHeight = element[0].getBoundingClientRect().height;

                if (focusPoint > viewPortHeight/2) { 
                    angular.element(element[0]).stop().animate({scrollTop: focusPoint - viewPortHeight/2}, 1000, "linear");
                }
                else {
                    angular.element(element[0]).stop().animate({scrollTop: 0}, 1000, "linear");
                }

            }
        });
    }
});