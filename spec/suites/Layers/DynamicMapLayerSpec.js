/* globals L:true describe:true it:true expect:true*/

describe('L.esri.DynamicMapLayer', function() {
    var map;
    beforeEach(function () {
        map = L.map(document.createElement('div'));
    });

    describe('#constructor', function() {
        describe('when a DynamicMapLayer is first created', function() {
            it('has some default parameters', function() {
                var dynLayer = L.esri.dynamicMapLayer('http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Recent/MapServer');
                var defaultParams = {
                    format: 'png8',
                        transparent: true,
                        f: 'image',
                        bboxSR: 102100,
                        imageSR: 102100,
                        layers: '',
                        opacity: 1
                };
                expect(dynLayer.defaultParams).to.eql(defaultParams);
            });
            it('can be assigned some default parameters', function() {
                var defaultParams = {
                    format: 'jpg',
                    transparent: true,
                    f: 'image',
                    bboxSR: 102100,
                    imageSR: 102100,
                    layers: '',
                    opacity: 0.5,
                    myname: 'johndoe'
                };
                var dynLayer = L.esri.dynamicMapLayer('http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Recent/MapServer', defaultParams);

                expect(dynLayer._layerParams.format).to.eql(defaultParams.format);
                expect(dynLayer._layerParams.myname).to.eql(defaultParams.myname);
            });
            it('will not set opacity when transparent parameter is false', function() {
                var defaultParams = {
                    transparent: false,
                    opacity: 0.5
                };
                var dynLayer = L.esri.dynamicMapLayer('http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Recent/MapServer', defaultParams);

                expect(dynLayer._layerParams.transparent).to.eql(defaultParams.transparent);
                expect(dynLayer._layerParams.opacity).not.to.eql(defaultParams.opacity);
                expect(dynLayer._layerParams.opacity).to.eql(1);
            });
        });
    });

    describe('#onAdd, #onRemove', function() {
        describe('when added to map', function() {
            it('will set map#on method and reset layer', function() {
                var dynLayer = L.esri.dynamicMapLayer('http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Recent/MapServer');
                map.on = sinon.spy();
                map._panes = {
                    overlayPane: {
                        appendChild: function() {}
                    }
                };
                dynLayer._image = sinon.stub();
                dynLayer._reset = sinon.spy();
                dynLayer.onAdd(map);
                expect(map.on.called).to.be.ok();
                expect(dynLayer._reset.called).to.be.ok();
            });
        });
        describe('when removed from map', function() {
            it('will call remove functions on map when onRemove called', function() {
                var dynLayer = L.esri.dynamicMapLayer('http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Recent/MapServer');
                map.addLayer(dynLayer);
                map.getPanes = sinon.stub().returns({
                    overlayPane: {
                        removeChild: function() {}
                    }
                });
                map.off = sinon.spy();
                dynLayer.onRemove(map);
                expect(map.getPanes.called).to.be.ok();
                expect(map.off.called).to.be.ok();
            });
        });
    });
});