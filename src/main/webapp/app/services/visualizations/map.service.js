(function () {
    'use strict';

    angular
        .module('flairbiApp')
        .factory('GenerateMap', GenerateMap);

    GenerateMap.$inject = ['VisualizationUtils', '$rootScope', 'D3Utils', 'filterParametersService'];

    function GenerateMap(VisualizationUtils, $rootScope, D3Utils, filterParametersService) {
        return {
            build: function (record, element, panel) {
                record.data = [
                    {
                        "country": "Afghanistan",
                        "Under 5 Years":50000
                    },
                    {
                        "country": "India",
                        "Under 5 Years":78500
                    },
                    {
                        "country": "Brazil",
                        "Under 5 Years":6666
                    },
                    {
                        "country": "Nepal",
                        "Under 5 Years":7000
                    },
                    {
                        "country": "Chile",
                        "Under 5 Years":4600
                    },
                    {
                        "country": "France",
                        "Under 5 Years":5000
                    },
                ];

                function getProperties(VisualizationUtils, record) {
                    var result = {};

                    var features = VisualizationUtils.getDimensionsAndMeasures(record.fields),
                        dimension = features.dimensions,
                        measure = features.measures;

                    result['dimension'] =['country']// [D3Utils.getNames(dimension)[0]];
                    result['measure'] = ['Under 5 Years']//[D3Utils.getNames(measure)[0]];

                    result['displayColor'] = VisualizationUtils.getFieldPropertyValue(dimension[0], 'Display colour');
                    result['borderColor'] = VisualizationUtils.getFieldPropertyValue(dimension[0], 'Border colour');
                    result['numberFormat'] = VisualizationUtils.getFieldPropertyValue(measure[0], 'Number format');

                    return result;
                }

                if (Object.keys($rootScope.updateWidget).indexOf(record.id) != -1) {
                    if ($rootScope.filterSelection.id != record.id) {
                        var map = $rootScope.updateWidget[record.id];
                        map.updateChart(record.data);
                    }
                } else {
                    d3.select(element[0]).html('')
                    var div = d3.select(element[0]).append('div')
                        .attr('id', 'map-' + element[0].id)
                        .style('width', element[0].clientWidth + 'px')
                        .style('height', element[0].clientHeight + 'px')
                        .style('overflow', 'hidden')
                        .style('text-align', 'center')
                        .style('position', 'relative');

                    var svg = div.append('svg')
                        .attr('width', element[0].clientWidth)
                        .attr('height', element[0].clientHeight)

                    var tooltip = div.append('div')
                        .attr('id', 'tooltip');

                    var map = flairVisualizations.map()
                        .config(getProperties(VisualizationUtils, record))
                        .tooltip(true)


                    svg.datum(record.data)
                        .call(map);

                    $rootScope.updateWidget[record.id] = map;
                }
            }
        }
    }
})();