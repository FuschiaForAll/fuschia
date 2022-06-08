
import { draftJsStuff } from '../../src/CodeGen/app-builder/utils';
import { Project } from '../../src/Projects/Project.entity';
import { expect } from 'chai';

const props =   {
  "properties": {
    "title": "Lorem Ipsum"
  },
  "style": {
    "height": {
      "blocks": [
        {
          "key": "f7prq",
          "text": "35",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
        }
      ],
      "entityMap": {},
      "type": "number"
    },
    "width": {
      "blocks": [
        {
          "key": "esgat",
          "text": "176",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": []
        }
      ],
      "type": "number",
      "entityMap": {}
    },
    "backgroundColor": "#000000",
    "borderRadius": {
      "blocks": [
        {
          "key": "k8ug",
          "text": "0",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": []
        }
      ],
      "type": "number",
      "entityMap": {}
    },
    "display": "flex",
    "position": "initial",
    "placement": "initial"
  }
}

const project = new Project()
describe('functional', () => {
  const draftConversion = draftJsStuff(props, [], project, [])
  it('should equal the shape', () => {
    expect(draftConversion).to.deep.equal({
       properties: {
         title: "Lorem Ipsum"
        },
         style: {
          backgroundColor: "#000000",
          borderRadius: 0,
          display: "flex",
          height: 35,
          placement: "initial",
          position: "initial",
          width: 176
         }
       })
  })
})