const ModelGeoJSONType = `
"GeoJSON object types"
enum ModelGeoJSONType {
  Point
  MultiPoint
  LineString
  MultiLineString
  Polygon
  MultiPolygon
  GeometryCollection
  Feature
  FeatureCollection
}
`;

const GeoScalars = `
scalar GeoJSONCoordinates
scalar GeoJSONObject
`;

const GeoResolvers = {
  GeoJSONCoordinates: (parent, args, context, info) => {},
};

exports.GeoScalars = GeoScalars;
exports.ModelGeoJSONType = ModelGeoJSONType;
