'use strict';

describe('Directive: mandelbrot', function () {

  // load the directive's module
  beforeEach(module('mandelbrotApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should find the set', inject(function ($compile) {
    element = angular.element('<mandelbrot></mandelbrot>');
    element = $compile(element)(scope);

    expect(scope.testPoint(2,0)).toBe(0);
    expect(scope.testPoint(0.70544,0.69327)).toBe(2);
    expect(scope.testPoint(1.25657,0.81247)).toBe(1);
    
  }));
});
