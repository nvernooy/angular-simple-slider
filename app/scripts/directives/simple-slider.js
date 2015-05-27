angular.module('angularSimpleSlider')
  .directive('simpleSlider', ['SimpleSliderService', '$timeout', function (SimpleSliderService, $timeout) {

    'use strict';

    return {

      restrict: 'AE',
      scope: {
        onChange: '&',
        current: '=?currentSlide',
        slider: '=?sliderInstance'
      },

      link: function postLink(scope, element, attrs) {
        var options = attrs, disposeWatcher, disposeCurrentWatcher;

        if (attrs.onChange) {
          options.onChange = scope.onChange;
        } else {
          options.onChange = function (prev, next) {
            if (parseInt(scope.current) !== next) {
              $timeout(function () {
                scope.$apply(function () {
                  scope.current = next;
                });
              });
            }
          };
        }

        if (element[0].children.length === 0) {
          disposeWatcher = scope.$watch(function () {
            return element[0].children.length > 0;
          }, function (hasChildren) {
            if (hasChildren) {
              scope.slider = new SimpleSliderService(element[0], options);
              disposeWatcher();
            }
          });
        } else {
          scope.slider = new SimpleSliderService(element[0], options);
        }

        disposeCurrentWatcher = scope.$watch('current', function(next, prev) {
          if (next && next !== prev) {
            scope.slider.change(parseInt(next));
          }
        });

        // Clears up all functionality from directive when removed
        scope.$on('$destroy', function () {

          // Dispose watchers
          disposeWatcher && disposeWatcher();
          disposeCurrentWatcher();

          // Dispose SimpleSlider instance
          options.onChange = null;
          scope.slider.onChange = null;
          scope.slider.dispose();

          // Clears scope attributes
          scope.slider = null;
          scope.onChange = null;
          scope.current = null;
        });
      }
    };
  }]);
