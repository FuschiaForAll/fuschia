import { ObjectId } from "mongodb";

export const assestFolder = "/tmp/6272d46446c9a45db8e719d4-app/src/assets";
export const projectInfo = {
  _id: "6272d46446c9a45db8e719d4",
  appId: "f9defc75-6ca0-49f9-9ed7-54392b818cc6",
  projectName: "ToDo",
  organization: "620b132662e5560e44d55a42",
  appConfig: {
    _id: "6272d46446c9a45db8e719d5",
    variables: [],
    appEntryComponentId: "628ce002338032d747aab7ca",
  },
  serverConfig: {
    liveJwtSecret: "d3adb3a3be1bdf0f39e5b2ad5ec236d526896650",
    sandboxJwtSecret: "5e758088e6704a0a3027942df98c35e44187bc9b",
    version: "0.0.3",
    apiConfig: {
      queries: [],
      mutations: [],
      subscriptions: [],
      models: [
        {
          name: "User",
          isLocal: false,
          _id: "6272d48346c9a45db8e71a02",
          keys: [],
          auth: [],
          fields: [
            {
              fieldName: "email",
              isUnique: true,
              isHashed: false,
              isList: false,
              nullable: false,
              dataType: "String",
              _id: "6272d48d46c9a45db8e71a18",
              rules: [],
              keys: [],
            },
            {
              fieldName: "password",
              isUnique: false,
              isHashed: true,
              isList: false,
              nullable: false,
              dataType: "String",
              _id: "6272d49346c9a45db8e71a31",
              rules: [],
              keys: [],
            },
            {
              fieldName: "user_type",
              isUnique: false,
              isHashed: false,
              isList: false,
              nullable: true,
              dataType: "String",
              _id: "627acaa84f2bcffc91f3f894",
              rules: [],
              keys: [],
            },
            {
              fieldName: "asdf",
              isUnique: false,
              isHashed: false,
              isList: false,
              nullable: true,
              dataType: "String",
              _id: "627accd14f2bcffc91f3fa62",
              rules: [],
              keys: [],
            },
          ],
        },
        {
          name: "ToDo",
          isLocal: false,
          _id: "6272d6c746c9a45db8e71b77",
          keys: [],
          auth: [],
          fields: [
            {
              fieldName: "Description",
              isUnique: false,
              isHashed: false,
              isList: false,
              nullable: true,
              dataType: "String",
              _id: "6272d6d246c9a45db8e71b96",
              rules: [],
              keys: [],
            },
          ],
        },
      ],
    },
    authConfig: {
      requiresAuth: true,
      allowUnauthenticatedUsers: false,
      mfaEnabled: false,
      mfaConfiguration: "OFF",
      mfaTypes: "SMS",
      smsAuthenticationMessage: "Your authentication code is {####}",
      smsVerificationMessage: "Your verification code is {####}",
      emailVerificationSubject: "Your verification code",
      emailVerificationMessage: "Your verification code is {####}",
      defaultPasswordPolicy: false,
      passwordPolicyMinLength: 8,
      passwordRequiresUppercase: false,
      passwordRequiresNumbers: false,
      passwordRequiresSymbols: false,
      requiredAttributes: [],
      clientRefreshTokenValidity: 10,
      usernameCaseSensitive: false,
      tableId: "6272d48346c9a45db8e71a02",
      usernameFieldId: "6272d48d46c9a45db8e71a18",
      passwordFieldId: "6272d49346c9a45db8e71a31",
      _id: "6272d46446c9a45db8e719d6",
    },
    _id: "6272d46446c9a45db8e719d7",
    ec2InstanceId: "i-01fd52d063ec09d7f",
    ec2PublicDns: "ec2-35-183-122-99.ca-central-1.compute.amazonaws.com",
  },
  __v: 9,
  assetLibrary: {
    assets: ["62866494fa7c65f6bbddc19d", "62a1fbb9037026a1ac8b1276"],
    _id: "62866494fa7c65f6bbddc19e",
  },
  labelLibrary: {
    _id: "62bb214bcab64fe7b6842648",
    labelTags: [],
    languages: [
      { name: "New", code: "new", _id: "62bb214bcab64fe7b6842649" },
      { name: "New", code: "new", _id: "62bb2158cab64fe7b684268a" },
    ],
    translations: [],
  },
};
export const rootComponent = {
  _id: new ObjectId("628ce002338032d747aab7ca"),
  projectId: "6272d46446c9a45db8e719d4",
  package: "@fuchsia-for-all/primitives",
  type: "Screen",
  name: "LoginScreen",
  x: 630.0000000000005,
  y: 352.1428571428574,
  componentType: "Screen",
  parameters: [],
  props: {
    properties: { text: "Page 1" },
    style: {
      height: {
        blocks: [
          {
            key: "tt9o",
            text: "667",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
          },
        ],
        type: "number",
      },
      width: 350,
      backgroundColor: "#ffffff",
    },
  },
  layout: null,
  layerSort: "0|hzzzzz:",
  fetched: [],
  __v: 0,
  children: [
    {
      _id: "628ce0f1338032d747aab7dd",
      projectId: "6272d46446c9a45db8e719d4",
      package: "@fuchsia-for-all/primitives",
      type: "Container",
      name: "Container",
      x: 0,
      y: 0,
      componentType: "Container",
      parameters: [],
      props: {
        style: {
          height: {
            blocks: [
              {
                key: "2i3tp",
                text: "150",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
              },
            ],
            type: "number",
          },
          width: {
            blocks: [
              {
                key: "ojfu",
                text: "",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
              },
            ],
            type: "number",
          },
          borderRadius: 5,
          backgroundColor: {
            blocks: [
              {
                key: "bgibq",
                text: "#f8e71c",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
              },
            ],
          },
          display: "flex",
          position: "initial",
          flex: {
            blocks: [
              {
                key: "vg3c",
                text: "",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
              },
            ],
          },
          margin: {
            left: {
              blocks: [
                {
                  key: "68tts",
                  text: "10",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
            right: {
              blocks: [
                {
                  key: "da0ev",
                  text: "10",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
            top: {
              blocks: [
                {
                  key: "2tao",
                  text: "10",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
            bottom: {
              blocks: [
                {
                  key: "9nptf",
                  text: "10",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
          },
          padding: {
            left: {
              blocks: [
                {
                  key: "3rno7",
                  text: "0",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
      },
      layout: null,
      parent: "628ce002338032d747aab7ca",
      layerSort: "0|hzzzzz:",
      fetched: [],
      __v: 0,
      children: [
        {
          _id: "628ce10f338032d747aab7ff",
          projectId: "6272d46446c9a45db8e719d4",
          package: "@fuchsia-for-all/primitives",
          type: "Text",
          name: "Text",
          x: 0,
          y: 0,
          componentType: "Element",
          parameters: [],
          props: {
            properties: { text: "Lorem Ipsum" },
            style: {
              height: {
                blocks: [
                  {
                    key: "5ce1s",
                    text: "24",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
                type: "number",
              },
              width: 160,
              color: {
                blocks: [
                  {
                    key: "3b1uh",
                    text: "#7ed321",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
              },
              display: "inline",
              position: "initial",
              font: {
                size: {
                  blocks: [
                    {
                      key: "303gm",
                      text: "18",
                      type: "unstyled",
                      depth: 0,
                      inlineStyleRanges: [],
                      entityRanges: [],
                    },
                  ],
                },
                style: {
                  blocks: [
                    {
                      key: "b8lv3",
                      text: "normal",
                      type: "unstyled",
                      depth: 0,
                      inlineStyleRanges: [],
                      entityRanges: [],
                    },
                  ],
                },
                weight: "weight",
                textAlign: "auto",
                textTransform: "none",
                lineHeight: "1em",
              },
            },
          },
          layout: null,
          parent: "628ce0f1338032d747aab7dd",
          layerSort: "0|hzzzzz:",
          fetched: [],
          __v: 0,
          children: [],
        },
        {
          _id: "628ce112338032d747aab803",
          projectId: "6272d46446c9a45db8e719d4",
          package: "@fuchsia-for-all/primitives",
          type: "TextInput",
          name: "UsernameTextInput",
          x: 0,
          y: 0,
          componentType: "Element",
          parameters: [],
          props: {
            properties: {
              placeholder: "Enter...",
              text: {
                blocks: [
                  {
                    key: "94nbu",
                    text: "undefined",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
              },
            },
            style: {
              height: 24,
              width: 160,
              color: "#000",
              borderColor: "#000",
              borderStyle: "solid",
              borderWidth: 1,
              borderRadius: 5,
            },
          },
          layout: null,
          parent: "628ce0f1338032d747aab7dd",
          layerSort: "0|i00007:",
          fetched: [],
          __v: 0,
          children: [],
        },
        {
          _id: "628ce114338032d747aab807",
          projectId: "6272d46446c9a45db8e719d4",
          package: "@fuchsia-for-all/primitives",
          type: "Text",
          name: "Text",
          x: 0,
          y: 0,
          componentType: "Element",
          parameters: [],
          props: {
            properties: { text: "Lorem Ipsum" },
            style: {
              height: 24,
              width: 160,
              color: "#000000",
              display: "inline",
              position: "initial",
            },
          },
          layout: null,
          parent: "628ce0f1338032d747aab7dd",
          layerSort: "0|i0000f:",
          fetched: [],
          __v: 0,
          children: [],
        },
        {
          _id: "628ce116338032d747aab80b",
          projectId: "6272d46446c9a45db8e719d4",
          package: "@fuchsia-for-all/primitives",
          type: "TextInput",
          name: "PasswordTextInput",
          x: 0,
          y: 0,
          componentType: "Element",
          parameters: [],
          props: {
            properties: {
              placeholder: "Enter...",
              text: {
                blocks: [
                  {
                    key: "4j6gs",
                    text: "undefined",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
              },
            },
            style: {
              height: 24,
              width: 160,
              color: "#000",
              borderColor: "#000",
              borderStyle: "solid",
              borderWidth: 1,
              borderRadius: 5,
            },
          },
          layout: null,
          parent: "628ce0f1338032d747aab7dd",
          layerSort: "0|i0000n:",
          fetched: [],
          __v: 0,
          children: [],
        },
        {
          _id: "628ce118338032d747aab80f",
          projectId: "6272d46446c9a45db8e719d4",
          package: "@fuchsia-for-all/primitives",
          type: "Button",
          name: "Button",
          x: 0,
          y: 0,
          componentType: "Container",
          parameters: [],
          props: {
            properties: { title: "Lorem Ipsum" },
            style: {
              height: 35,
              width: 175,
              backgroundColor: {
                blocks: [
                  {
                    key: "di3hk",
                    text: "#417505",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
              },
              borderRadius: 5,
              display: "flex",
              position: "initial",
              placement: "initial",
            },
            actions: {
              onPress: [
                {
                  type: "LOGIN",
                  _id: "67c07548-07fe-47e9-8e87-73a6a1b3a11e",
                  username: {
                    blocks: [
                      {
                        key: "alggk",
                        text: "UsernameTextInput's text",
                        type: "unstyled",
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [{ offset: 0, length: 24, key: 0 }],
                      },
                    ],
                    entityMap: {
                      "0": {
                        type: "PLACEHOLDER",
                        mutability: "IMMUTABLE",
                        data: [
                          {
                            value: "InputObject",
                            label: "Inputs",
                            type: "INPUT",
                          },
                          {
                            value: "628ce002338032d747aab7ca",
                            label: "LoginScreen",
                            type: "INPUT",
                          },
                          {
                            value: "628ce0f1338032d747aab7dd",
                            label: "Container",
                            type: "INPUT",
                          },
                          {
                            value: "628ce112338032d747aab803+text",
                            label: "UsernameTextInput's text",
                            type: "INPUT",
                          },
                        ],
                      },
                    },
                  },
                  password: {
                    blocks: [
                      {
                        key: "e3v1f",
                        text: "PasswordTextInput's text",
                        type: "unstyled",
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [{ offset: 0, length: 24, key: 0 }],
                      },
                    ],
                    entityMap: {
                      "0": {
                        type: "PLACEHOLDER",
                        mutability: "IMMUTABLE",
                        data: [
                          {
                            value: "InputObject",
                            label: "Inputs",
                            type: "INPUT",
                          },
                          {
                            value: "628ce002338032d747aab7ca",
                            label: "LoginScreen",
                            type: "INPUT",
                          },
                          {
                            value: "628ce0f1338032d747aab7dd",
                            label: "Container",
                            type: "INPUT",
                          },
                          {
                            value: "628ce116338032d747aab80b+text",
                            label: "PasswordTextInput's text",
                            type: "INPUT",
                          },
                        ],
                      },
                    },
                  },
                  onSucess: [
                    {
                      type: "NAVIGATE",
                      _id: "27cd2dde-16bb-4d4f-a8da-a1368773a91b",
                      destination: "62a0c683a156f707ede31868",
                    },
                  ],
                  onFail: [
                    {
                      type: "ALERT",
                      _id: "8eb21cda-a406-4413-b10f-c625827d3de5",
                      message: {
                        blocks: [
                          {
                            key: "cvop4",
                            text: "Failed to login",
                            type: "unstyled",
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          },
          layout: null,
          parent: "628ce0f1338032d747aab7dd",
          layerSort: "0|i0000v:",
          fetched: [],
          __v: 0,
          children: [
            {
              _id: "628ce126338032d747aab815",
              projectId: "6272d46446c9a45db8e719d4",
              package: "@fuchsia-for-all/primitives",
              type: "Text",
              name: "Text",
              x: 0,
              y: 0,
              componentType: "Element",
              parameters: [],
              props: {
                properties: {
                  text: {
                    blocks: [
                      {
                        key: "6u60b",
                        text: "Lorem Ipsum",
                        type: "unstyled",
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                      },
                    ],
                  },
                },
                style: {
                  height: 24,
                  width: 160,
                  color: {
                    blocks: [
                      {
                        key: "an3c0",
                        text: "#ffffff",
                        type: "unstyled",
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                      },
                    ],
                  },
                  display: "inline",
                  position: "initial",
                },
              },
              layout: null,
              parent: "628ce118338032d747aab80f",
              layerSort: "0|hzzzzz:",
              fetched: [],
              __v: 0,
              children: [],
            },
          ],
        },
      ],
    },
    {
      _id: "62bb277ccab64fe7b68426da",
      projectId: "6272d46446c9a45db8e719d4",
      package: "@fuchsia-for-all/primitives",
      type: "Button",
      name: "Button",
      x: 0,
      y: 0,
      componentType: "Container",
      parameters: [],
      props: {
        properties: { title: "Lorem Ipsum" },
        style: {
          height: 35,
          width: 175,
          backgroundColor: "#000000",
          borderRadius: 5,
          display: "flex",
          position: "initial",
          placement: "initial",
          margin: {
            left: {
              blocks: [
                {
                  key: "dvqf3",
                  text: "50",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
            right: {
              blocks: [
                {
                  key: "f12dq",
                  text: "0",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
            top: {
              blocks: [
                {
                  key: "9c008",
                  text: "10",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
            bottom: 0,
          },
        },
      },
      layout: null,
      parent: "628ce002338032d747aab7ca",
      layerSort: "0|i00007:",
      fetched: [],
      __v: 0,
      children: [],
    },
  ],
};
export const rootComponents = [
  {
    _id: new ObjectId("628ce002338032d747aab7ca"),
    projectId: "6272d46446c9a45db8e719d4",
    package: "@fuchsia-for-all/primitives",
    type: "Screen",
    name: "LoginScreen",
    x: 630.0000000000005,
    y: 352.1428571428574,
    componentType: "Screen",
    parameters: [],
    props: {
      properties: { text: "Page 1" },
      style: {
        height: {
          blocks: [
            {
              key: "tt9o",
              text: "667",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
            },
          ],
          type: "number",
        },
        width: 350,
        backgroundColor: "#ffffff",
      },
    },
    layout: null,
    layerSort: "0|hzzzzz:",
    fetched: [],
    __v: 0,
    children: [
      {
        _id: "628ce0f1338032d747aab7dd",
        projectId: "6272d46446c9a45db8e719d4",
        package: "@fuchsia-for-all/primitives",
        type: "Container",
        name: "Container",
        x: 0,
        y: 0,
        componentType: "Container",
        parameters: [],
        props: {
          style: {
            height: {
              blocks: [
                {
                  key: "2i3tp",
                  text: "150",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
            width: {
              blocks: [
                {
                  key: "ojfu",
                  text: "",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
            borderRadius: 5,
            backgroundColor: {
              blocks: [
                {
                  key: "bgibq",
                  text: "#f8e71c",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
            },
            display: "flex",
            position: "initial",
            flex: {
              blocks: [
                {
                  key: "vg3c",
                  text: "",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
            },
            margin: {
              left: {
                blocks: [
                  {
                    key: "68tts",
                    text: "10",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
                type: "number",
              },
              right: {
                blocks: [
                  {
                    key: "da0ev",
                    text: "10",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
                type: "number",
              },
              top: {
                blocks: [
                  {
                    key: "2tao",
                    text: "10",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
                type: "number",
              },
              bottom: {
                blocks: [
                  {
                    key: "9nptf",
                    text: "10",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
                type: "number",
              },
            },
            padding: {
              left: {
                blocks: [
                  {
                    key: "3rno7",
                    text: "0",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
                type: "number",
              },
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
        },
        layout: null,
        parent: "628ce002338032d747aab7ca",
        layerSort: "0|hzzzzz:",
        fetched: [],
        __v: 0,
        children: [
          {
            _id: "628ce10f338032d747aab7ff",
            projectId: "6272d46446c9a45db8e719d4",
            package: "@fuchsia-for-all/primitives",
            type: "Text",
            name: "Text",
            x: 0,
            y: 0,
            componentType: "Element",
            parameters: [],
            props: {
              properties: { text: "Lorem Ipsum" },
              style: {
                height: {
                  blocks: [
                    {
                      key: "5ce1s",
                      text: "24",
                      type: "unstyled",
                      depth: 0,
                      inlineStyleRanges: [],
                      entityRanges: [],
                    },
                  ],
                  type: "number",
                },
                width: 160,
                color: {
                  blocks: [
                    {
                      key: "3b1uh",
                      text: "#7ed321",
                      type: "unstyled",
                      depth: 0,
                      inlineStyleRanges: [],
                      entityRanges: [],
                    },
                  ],
                },
                display: "inline",
                position: "initial",
                font: {
                  size: {
                    blocks: [
                      {
                        key: "303gm",
                        text: "18",
                        type: "unstyled",
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                      },
                    ],
                  },
                  style: {
                    blocks: [
                      {
                        key: "b8lv3",
                        text: "normal",
                        type: "unstyled",
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                      },
                    ],
                  },
                  weight: "weight",
                  textAlign: "auto",
                  textTransform: "none",
                  lineHeight: "1em",
                },
              },
            },
            layout: null,
            parent: "628ce0f1338032d747aab7dd",
            layerSort: "0|hzzzzz:",
            fetched: [],
            __v: 0,
            children: [],
          },
          {
            _id: "628ce112338032d747aab803",
            projectId: "6272d46446c9a45db8e719d4",
            package: "@fuchsia-for-all/primitives",
            type: "TextInput",
            name: "UsernameTextInput",
            x: 0,
            y: 0,
            componentType: "Element",
            parameters: [],
            props: {
              properties: {
                placeholder: "Enter...",
                text: {
                  blocks: [
                    {
                      key: "94nbu",
                      text: "undefined",
                      type: "unstyled",
                      depth: 0,
                      inlineStyleRanges: [],
                      entityRanges: [],
                    },
                  ],
                },
              },
              style: {
                height: 24,
                width: 160,
                color: "#000",
                borderColor: "#000",
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: 5,
              },
            },
            layout: null,
            parent: "628ce0f1338032d747aab7dd",
            layerSort: "0|i00007:",
            fetched: [],
            __v: 0,
            children: [],
          },
          {
            _id: "628ce114338032d747aab807",
            projectId: "6272d46446c9a45db8e719d4",
            package: "@fuchsia-for-all/primitives",
            type: "Text",
            name: "Text",
            x: 0,
            y: 0,
            componentType: "Element",
            parameters: [],
            props: {
              properties: { text: "Lorem Ipsum" },
              style: {
                height: 24,
                width: 160,
                color: "#000000",
                display: "inline",
                position: "initial",
              },
            },
            layout: null,
            parent: "628ce0f1338032d747aab7dd",
            layerSort: "0|i0000f:",
            fetched: [],
            __v: 0,
            children: [],
          },
          {
            _id: "628ce116338032d747aab80b",
            projectId: "6272d46446c9a45db8e719d4",
            package: "@fuchsia-for-all/primitives",
            type: "TextInput",
            name: "PasswordTextInput",
            x: 0,
            y: 0,
            componentType: "Element",
            parameters: [],
            props: {
              properties: {
                placeholder: "Enter...",
                text: {
                  blocks: [
                    {
                      key: "4j6gs",
                      text: "undefined",
                      type: "unstyled",
                      depth: 0,
                      inlineStyleRanges: [],
                      entityRanges: [],
                    },
                  ],
                },
              },
              style: {
                height: 24,
                width: 160,
                color: "#000",
                borderColor: "#000",
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: 5,
              },
            },
            layout: null,
            parent: "628ce0f1338032d747aab7dd",
            layerSort: "0|i0000n:",
            fetched: [],
            __v: 0,
            children: [],
          },
          {
            _id: "628ce118338032d747aab80f",
            projectId: "6272d46446c9a45db8e719d4",
            package: "@fuchsia-for-all/primitives",
            type: "Button",
            name: "Button",
            x: 0,
            y: 0,
            componentType: "Container",
            parameters: [],
            props: {
              properties: { title: "Lorem Ipsum" },
              style: {
                height: 35,
                width: 175,
                backgroundColor: {
                  blocks: [
                    {
                      key: "di3hk",
                      text: "#417505",
                      type: "unstyled",
                      depth: 0,
                      inlineStyleRanges: [],
                      entityRanges: [],
                    },
                  ],
                },
                borderRadius: 5,
                display: "flex",
                position: "initial",
                placement: "initial",
              },
              actions: {
                onPress: [
                  {
                    type: "LOGIN",
                    _id: "67c07548-07fe-47e9-8e87-73a6a1b3a11e",
                    username: {
                      blocks: [
                        {
                          key: "alggk",
                          text: "UsernameTextInput's text",
                          type: "unstyled",
                          depth: 0,
                          inlineStyleRanges: [],
                          entityRanges: [{ offset: 0, length: 24, key: 0 }],
                        },
                      ],
                      entityMap: {
                        "0": {
                          type: "PLACEHOLDER",
                          mutability: "IMMUTABLE",
                          data: [
                            {
                              value: "InputObject",
                              label: "Inputs",
                              type: "INPUT",
                            },
                            {
                              value: "628ce002338032d747aab7ca",
                              label: "LoginScreen",
                              type: "INPUT",
                            },
                            {
                              value: "628ce0f1338032d747aab7dd",
                              label: "Container",
                              type: "INPUT",
                            },
                            {
                              value: "628ce112338032d747aab803+text",
                              label: "UsernameTextInput's text",
                              type: "INPUT",
                            },
                          ],
                        },
                      },
                    },
                    password: {
                      blocks: [
                        {
                          key: "e3v1f",
                          text: "PasswordTextInput's text",
                          type: "unstyled",
                          depth: 0,
                          inlineStyleRanges: [],
                          entityRanges: [{ offset: 0, length: 24, key: 0 }],
                        },
                      ],
                      entityMap: {
                        "0": {
                          type: "PLACEHOLDER",
                          mutability: "IMMUTABLE",
                          data: [
                            {
                              value: "InputObject",
                              label: "Inputs",
                              type: "INPUT",
                            },
                            {
                              value: "628ce002338032d747aab7ca",
                              label: "LoginScreen",
                              type: "INPUT",
                            },
                            {
                              value: "628ce0f1338032d747aab7dd",
                              label: "Container",
                              type: "INPUT",
                            },
                            {
                              value: "628ce116338032d747aab80b+text",
                              label: "PasswordTextInput's text",
                              type: "INPUT",
                            },
                          ],
                        },
                      },
                    },
                    onSucess: [
                      {
                        type: "NAVIGATE",
                        _id: "27cd2dde-16bb-4d4f-a8da-a1368773a91b",
                        destination: "62a0c683a156f707ede31868",
                      },
                    ],
                    onFail: [
                      {
                        type: "ALERT",
                        _id: "8eb21cda-a406-4413-b10f-c625827d3de5",
                        message: {
                          blocks: [
                            {
                              key: "cvop4",
                              text: "Failed to login",
                              type: "unstyled",
                              depth: 0,
                              inlineStyleRanges: [],
                              entityRanges: [],
                            },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            },
            layout: null,
            parent: "628ce0f1338032d747aab7dd",
            layerSort: "0|i0000v:",
            fetched: [],
            __v: 0,
            children: [
              {
                _id: "628ce126338032d747aab815",
                projectId: "6272d46446c9a45db8e719d4",
                package: "@fuchsia-for-all/primitives",
                type: "Text",
                name: "Text",
                x: 0,
                y: 0,
                componentType: "Element",
                parameters: [],
                props: {
                  properties: {
                    text: {
                      blocks: [
                        {
                          key: "6u60b",
                          text: "Lorem Ipsum",
                          type: "unstyled",
                          depth: 0,
                          inlineStyleRanges: [],
                          entityRanges: [],
                        },
                      ],
                    },
                  },
                  style: {
                    height: 24,
                    width: 160,
                    color: {
                      blocks: [
                        {
                          key: "an3c0",
                          text: "#ffffff",
                          type: "unstyled",
                          depth: 0,
                          inlineStyleRanges: [],
                          entityRanges: [],
                        },
                      ],
                    },
                    display: "inline",
                    position: "initial",
                  },
                },
                layout: null,
                parent: "628ce118338032d747aab80f",
                layerSort: "0|hzzzzz:",
                fetched: [],
                __v: 0,
                children: [],
              },
            ],
          },
        ],
      },
      {
        _id: "62bb277ccab64fe7b68426da",
        projectId: "6272d46446c9a45db8e719d4",
        package: "@fuchsia-for-all/primitives",
        type: "Button",
        name: "Button",
        x: 0,
        y: 0,
        componentType: "Container",
        parameters: [],
        props: {
          properties: { title: "Lorem Ipsum" },
          style: {
            height: 35,
            width: 175,
            backgroundColor: "#000000",
            borderRadius: 5,
            display: "flex",
            position: "initial",
            placement: "initial",
            margin: {
              left: {
                blocks: [
                  {
                    key: "dvqf3",
                    text: "50",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
                type: "number",
              },
              right: {
                blocks: [
                  {
                    key: "f12dq",
                    text: "0",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
                type: "number",
              },
              top: {
                blocks: [
                  {
                    key: "9c008",
                    text: "10",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
                type: "number",
              },
              bottom: 0,
            },
          },
        },
        layout: null,
        parent: "628ce002338032d747aab7ca",
        layerSort: "0|i00007:",
        fetched: [],
        __v: 0,
        children: [],
      },
    ],
  },
  {
    _id: new ObjectId("62a0c683a156f707ede31868"),
    projectId: "6272d46446c9a45db8e719d4",
    package: "@fuchsia-for-all/primitives",
    type: "Screen",
    name: "HomeScreen",
    x: 1053.3333333333323,
    y: 352.49999999999994,
    componentType: "Screen",
    parameters: [],
    props: {
      properties: {
        text: {
          blocks: [
            {
              key: "e6er5",
              text: "Page 1",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
            },
          ],
        },
      },
      style: {
        height: {
          blocks: [
            {
              key: "8ceab",
              text: "667",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
            },
          ],
          type: "number",
        },
        width: {
          blocks: [
            {
              key: "6g1j4",
              text: "350",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
            },
          ],
          type: "number",
        },
        backgroundColor: "#ffffff",
        flexContainer: {
          flexDirection: {
            blocks: [
              {
                key: "4ugml",
                text: "",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
              },
            ],
          },
          alignItems: {
            blocks: [
              {
                key: "3p4io",
                text: "",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
              },
            ],
          },
          alignContent: "",
          justifyContent: "",
          justifyItems: "",
          flexWrap: "",
          gap: "",
        },
        padding: {
          left: {
            blocks: [
              {
                key: "7v7kf",
                text: "0",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
              },
            ],
            type: "number",
          },
          right: 0,
          top: {
            blocks: [
              {
                key: "cqdu2",
                text: "0",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
              },
            ],
            type: "number",
          },
          bottom: 0,
        },
      },
      actions: {
        onLoad: [
          {
            type: "EMAIL",
            _id: "4a59e1ce-c4cd-4c4b-9de0-e8368f697124",
            message: {
              blocks: [
                {
                  key: "1phif",
                  text: "undefined",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
            },
          },
        ],
      },
    },
    layout: null,
    layerSort: "0|i00007:",
    fetched: [],
    __v: 0,
    children: [
      {
        _id: "62a1f302714db40d8af87371",
        projectId: "6272d46446c9a45db8e719d4",
        package: "@fuchsia-for-all/primitives",
        type: "ImageBackground",
        name: "ImageBackground",
        x: 0,
        y: 0,
        componentType: "Container",
        parameters: [],
        props: {
          style: {
            height: {
              blocks: [
                {
                  key: "a5dg6",
                  text: "",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
            width: {
              blocks: [
                {
                  key: "55ope",
                  text: "",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
            borderRadius: {
              blocks: [
                {
                  key: "bi2ql",
                  text: "",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
              type: "number",
            },
            backgroundColor: {
              blocks: [
                {
                  key: "1ekom",
                  text: "#7ed321",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
            },
            backgroundImage: {
              source: {
                blocks: [
                  {
                    key: "4651j",
                    text: "8a66d311-1adf-4436-833a-efcf4acc0c88.jpg",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [{ offset: 0, length: 40, key: 0 }],
                  },
                ],
                entityMap: {
                  "0": {
                    type: "PLACEHOLDER",
                    mutability: "IMMUTABLE",
                    data: [
                      { value: "AssetObject", label: "Assets", type: "ASSET" },
                      { value: "Images", label: "Images", type: "ASSET" },
                      {
                        value: "8a66d311-1adf-4436-833a-efcf4acc0c88.jpg",
                        label: "8a66d311-1adf-4436-833a-efcf4acc0c88.jpg",
                        type: "ASSET",
                      },
                    ],
                  },
                },
              },
              resizeMode: {
                blocks: [
                  {
                    key: "f2a7q",
                    text: "contain",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
              },
              style: {
                justifyContent: {
                  blocks: [
                    {
                      key: "53kod",
                      text: "",
                      type: "unstyled",
                      depth: 0,
                      inlineStyleRanges: [],
                      entityRanges: [],
                    },
                  ],
                },
                flex: {
                  blocks: [
                    {
                      key: "86obc",
                      text: "1",
                      type: "unstyled",
                      depth: 0,
                      inlineStyleRanges: [],
                      entityRanges: [],
                    },
                  ],
                  type: "number",
                },
              },
            },
          },
          layout: {
            display: {
              blocks: [
                {
                  key: "a2hpb",
                  text: "flex",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
            },
            position: {
              blocks: [
                {
                  key: "bgbps",
                  text: "initial",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
            },
            flex: {
              blocks: [
                {
                  key: "7tuap",
                  text: "1",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
            },
          },
        },
        layout: null,
        parent: "62a0c683a156f707ede31868",
        layerSort: "0|hzzzzz:",
        fetched: [],
        __v: 0,
        children: [],
      },
    ],
  },
  {
    _id: new ObjectId("62bb1b54cab64fe7b6842600"),
    projectId: "6272d46446c9a45db8e719d4",
    package: "@fuchsia-for-all/primitives",
    type: "Screen",
    name: "Screen",
    x: 1488.5714285714287,
    y: 339.2857142857142,
    componentType: "Screen",
    parameters: [],
    props: {
      properties: { text: "Page 1" },
      style: { height: 667, width: 350, backgroundColor: "#ffffff" },
    },
    layout: null,
    layerSort: "0|i0000f:",
    fetched: [],
    __v: 0,
    children: [],
  },
];
export const srcdir = "/tmp/6272d46446c9a45db8e719d4-app/src";
export const packagesData = [
  {
    _id: "628695e9891321c8b9743592",
    packageName: "@fuchsia-for-all/primitives",
    repositoryUrl: "git@github.com:FuschiaForAll/primitives.git",
    version: "1.0.8",
    bundle:
      '(()=>{var e={429:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return(0,o.default)(e)};var r,o=(r=n(196))&&r.__esModule?r:{default:r};e.exports=t.default},896:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return"string"==typeof e&&n.test(e)};var n=/-webkit-|-moz-|-ms-/;e.exports=t.default},657:e=>{"use strict";var t=!("undefined"==typeof window||!window.document||!window.document.createElement),n={canUseDOM:t,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:t&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:t&&!!window.screen,isInWorker:!t};e.exports=n},660:e=>{"use strict";e.exports=function(e,t){for(var n=arguments.length,r=new Array(n>2?n-2:0),o=2;o<n;o++)r[o-2]=arguments[o];if(!e){var i;if(void 0===t)i=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var a=0;(i=new Error(t.replace(/%s/g,(function(){return String(r[a++])})))).name="Invariant Violation"}throw i.framesToPop=1,i}}},196:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>l});var r=/[A-Z]/g,o=/^ms-/,i={};function a(e){return"-"+e.toLowerCase()}const l=function(e){if(i.hasOwnProperty(e))return i[e];var t=e.replace(r,a);return i[e]=o.test(t)?"-"+t:t}},205:(e,t,n)=>{"use strict";t.Z=function(e){var t=e.prefixMap,n=e.plugins;return function e(l){for(var u in l){var s=l[u];if((0,a.default)(s))l[u]=e(s);else if(Array.isArray(s)){for(var c=[],d=0,f=s.length;d<f;++d){var p=(0,o.default)(n,u,s[d],l,t);(0,i.default)(c,p||s[d])}c.length>0&&(l[u]=c)}else{var v=(0,o.default)(n,u,s,l,t);v&&(l[u]=v),l=(0,r.default)(t,u,l)}}return l}};var r=l(n(379)),o=l(n(665)),i=l(n(705)),a=l(n(417));function l(e){return e&&e.__esModule?e:{default:e}}},477:(e,t)=>{"use strict";t.Z=function(e,t){if("string"==typeof t&&"text"===t)return["-webkit-text","text"]}},122:(e,t,n)=>{"use strict";t.Z=function(e,t){if("string"==typeof t&&!(0,o.default)(t)&&t.indexOf("cross-fade(")>-1)return i.map((function(e){return t.replace(/cross-fade\\(/g,e+"cross-fade(")}))};var r,o=(r=n(896))&&r.__esModule?r:{default:r},i=["-webkit-",""]},461:(e,t)=>{"use strict";t.Z=function(e,t){if("cursor"===e&&r.hasOwnProperty(t))return n.map((function(e){return e+t}))};var n=["-webkit-","-moz-",""],r={"zoom-in":!0,"zoom-out":!0,grab:!0,grabbing:!0}},411:(e,t,n)=>{"use strict";t.Z=function(e,t){if("string"==typeof t&&!(0,o.default)(t)&&t.indexOf("filter(")>-1)return i.map((function(e){return t.replace(/filter\\(/g,e+"filter(")}))};var r,o=(r=n(896))&&r.__esModule?r:{default:r},i=["-webkit-",""]},911:(e,t)=>{"use strict";t.Z=function(e,t){if("display"===e&&n.hasOwnProperty(t))return n[t]};var n={flex:["-webkit-box","-moz-box","-ms-flexbox","-webkit-flex","flex"],"inline-flex":["-webkit-inline-box","-moz-inline-box","-ms-inline-flexbox","-webkit-inline-flex","inline-flex"]}},201:(e,t)=>{"use strict";t.Z=function(e,t,l){if(Object.prototype.hasOwnProperty.call(r,e)&&(l[r[e]]=n[t]||t),"flex"===e){if(Object.prototype.hasOwnProperty.call(o,t))return void(l.msFlex=o[t]);if(i.test(t))return void(l.msFlex=t+" 1 0%");if("number"==typeof t&&t<0)return void console.warn(a+\': "flex: \'+t+\'", negative values is not valid and will be ignored.\');if(!t.split)return console.warn(a+\': "flex: \'+t+\'", value format is not detected, it will be remain as is\'),void(l.msFlex=t);var u=t.split(/\\s/);switch(u.length){case 1:return void(l.msFlex="1 1 "+t);case 2:return void(i.test(u[1])?l.msFlex=u[0]+" "+u[1]+" 0%":l.msFlex=u[0]+" 1 "+u[1]);default:l.msFlex=t}}};var n={"space-around":"distribute","space-between":"justify","flex-start":"start","flex-end":"end"},r={alignContent:"msFlexLinePack",alignSelf:"msFlexItemAlign",alignItems:"msFlexAlign",justifyContent:"msFlexPack",order:"msFlexOrder",flexGrow:"msFlexPositive",flexShrink:"msFlexNegative",flexBasis:"msFlexPreferredSize"},o={auto:"1 1 auto",inherit:"inherit",initial:"0 1 auto",none:"0 0 auto",unset:"unset"},i=/^\\d+(\\.\\d+)?$/,a="inline-style-prefixer.flexboxIE plugin"},512:(e,t)=>{"use strict";t.Z=function(e,t,o){"flexDirection"===e&&"string"==typeof t&&(t.indexOf("column")>-1?o.WebkitBoxOrient="vertical":o.WebkitBoxOrient="horizontal",t.indexOf("reverse")>-1?o.WebkitBoxDirection="reverse":o.WebkitBoxDirection="normal"),r.hasOwnProperty(e)&&(o[r[e]]=n[t]||t)};var n={"space-around":"justify","space-between":"justify","flex-start":"start","flex-end":"end","wrap-reverse":"multiple",wrap:"multiple"},r={alignItems:"WebkitBoxAlign",justifyContent:"WebkitBoxPack",flexWrap:"WebkitBoxLines",flexGrow:"WebkitBoxFlex"}},543:(e,t,n)=>{"use strict";t.Z=function(e,t){if("string"==typeof t&&!(0,o.default)(t)&&a.test(t))return i.map((function(e){return t.replace(a,(function(t){return e+t}))}))};var r,o=(r=n(896))&&r.__esModule?r:{default:r},i=["-webkit-","-moz-",""],a=/linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient/gi},670:(e,t)=>{"use strict";var n=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,l=e[Symbol.iterator]();!(r=(a=l.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&l.return&&l.return()}finally{if(o)throw i}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")};function r(e){return"number"==typeof e&&!isNaN(e)}function o(e){return"string"==typeof e&&e.includes("/")}t.Z=function(e,t,n){if("display"===e&&t in a)return a[t];e in l&&(0,l[e])(t,n)};var i=["center","end","start","stretch"],a={"inline-grid":["-ms-inline-grid","inline-grid"],grid:["-ms-grid","grid"]},l={alignSelf:function(e,t){i.indexOf(e)>-1&&(t.msGridRowAlign=e)},gridColumn:function(e,t){if(r(e))t.msGridColumn=e;else if(o(e)){var i=e.split("/"),a=n(i,2),u=a[0],s=a[1];l.gridColumnStart(+u,t);var c=s.split(/ ?span /),d=n(c,2),f=d[0],p=d[1];""===f?l.gridColumnEnd(+u+ +p,t):l.gridColumnEnd(+s,t)}else l.gridColumnStart(e,t)},gridColumnEnd:function(e,t){var n=t.msGridColumn;r(e)&&r(n)&&(t.msGridColumnSpan=e-n)},gridColumnStart:function(e,t){r(e)&&(t.msGridColumn=e)},gridRow:function(e,t){if(r(e))t.msGridRow=e;else if(o(e)){var i=e.split("/"),a=n(i,2),u=a[0],s=a[1];l.gridRowStart(+u,t);var c=s.split(/ ?span /),d=n(c,2),f=d[0],p=d[1];""===f?l.gridRowEnd(+u+ +p,t):l.gridRowEnd(+s,t)}else l.gridRowStart(e,t)},gridRowEnd:function(e,t){var n=t.msGridRow;r(e)&&r(n)&&(t.msGridRowSpan=e-n)},gridRowStart:function(e,t){r(e)&&(t.msGridRow=e)},gridTemplateColumns:function(e,t){t.msGridColumns=e},gridTemplateRows:function(e,t){t.msGridRows=e},justifySelf:function(e,t){i.indexOf(e)>-1&&(t.msGridColumnAlign=e)}}},585:(e,t,n)=>{"use strict";t.Z=function(e,t){if("string"==typeof t&&!(0,o.default)(t)&&t.indexOf("image-set(")>-1)return i.map((function(e){return t.replace(/image-set\\(/g,e+"image-set(")}))};var r,o=(r=n(896))&&r.__esModule?r:{default:r},i=["-webkit-",""]},594:(e,t)=>{"use strict";t.Z=function(e,t,r){if(Object.prototype.hasOwnProperty.call(n,e))for(var o=n[e],i=0,a=o.length;i<a;++i)r[o[i]]=t};var n={marginBlockStart:["WebkitMarginBefore"],marginBlockEnd:["WebkitMarginAfter"],marginInlineStart:["WebkitMarginStart","MozMarginStart"],marginInlineEnd:["WebkitMarginEnd","MozMarginEnd"],paddingBlockStart:["WebkitPaddingBefore"],paddingBlockEnd:["WebkitPaddingAfter"],paddingInlineStart:["WebkitPaddingStart","MozPaddingStart"],paddingInlineEnd:["WebkitPaddingEnd","MozPaddingEnd"],borderBlockStart:["WebkitBorderBefore"],borderBlockStartColor:["WebkitBorderBeforeColor"],borderBlockStartStyle:["WebkitBorderBeforeStyle"],borderBlockStartWidth:["WebkitBorderBeforeWidth"],borderBlockEnd:["WebkitBorderAfter"],borderBlockEndColor:["WebkitBorderAfterColor"],borderBlockEndStyle:["WebkitBorderAfterStyle"],borderBlockEndWidth:["WebkitBorderAfterWidth"],borderInlineStart:["WebkitBorderStart","MozBorderStart"],borderInlineStartColor:["WebkitBorderStartColor","MozBorderStartColor"],borderInlineStartStyle:["WebkitBorderStartStyle","MozBorderStartStyle"],borderInlineStartWidth:["WebkitBorderStartWidth","MozBorderStartWidth"],borderInlineEnd:["WebkitBorderEnd","MozBorderEnd"],borderInlineEndColor:["WebkitBorderEndColor","MozBorderEndColor"],borderInlineEndStyle:["WebkitBorderEndStyle","MozBorderEndStyle"],borderInlineEndWidth:["WebkitBorderEndWidth","MozBorderEndWidth"]}},494:(e,t)=>{"use strict";t.Z=function(e,t){if("position"===e&&"sticky"===t)return["-webkit-sticky","sticky"]}},989:(e,t)=>{"use strict";t.Z=function(e,t){if(r.hasOwnProperty(e)&&o.hasOwnProperty(t))return n.map((function(e){return e+t}))};var n=["-webkit-","-moz-",""],r={maxHeight:!0,maxWidth:!0,width:!0,height:!0,columnWidth:!0,minWidth:!0,minHeight:!0},o={"min-content":!0,"max-content":!0,"fill-available":!0,"fit-content":!0,"contain-floats":!0}},832:(e,t,n)=>{"use strict";t.Z=function(e,t,n,a){if("string"==typeof t&&l.hasOwnProperty(e)){var s=function(e,t){if((0,o.default)(e))return e;for(var n=e.split(/,(?![^()]*(?:\\([^()]*\\))?\\))/g),i=0,a=n.length;i<a;++i){var l=n[i],s=[l];for(var c in t){var d=(0,r.default)(c);if(l.indexOf(d)>-1&&"order"!==d)for(var f=t[c],p=0,v=f.length;p<v;++p)s.unshift(l.replace(d,u[f[p]]+d))}n[i]=s.join(",")}return n.join(",")}(t,a),c=s.split(/,(?![^()]*(?:\\([^()]*\\))?\\))/g).filter((function(e){return!/-moz-|-ms-/.test(e)})).join(",");if(e.indexOf("Webkit")>-1)return c;var d=s.split(/,(?![^()]*(?:\\([^()]*\\))?\\))/g).filter((function(e){return!/-webkit-|-ms-/.test(e)})).join(",");return e.indexOf("Moz")>-1?d:(n["Webkit"+(0,i.default)(e)]=c,n["Moz"+(0,i.default)(e)]=d,s)}};var r=a(n(429)),o=a(n(896)),i=a(n(125));function a(e){return e&&e.__esModule?e:{default:e}}var l={transition:!0,transitionProperty:!0,WebkitTransition:!0,WebkitTransitionProperty:!0,MozTransition:!0,MozTransitionProperty:!0},u={Webkit:"-webkit-",Moz:"-moz-",ms:"-ms-"}},705:(e,t)=>{"use strict";function n(e,t){-1===e.indexOf(t)&&e.push(t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){if(Array.isArray(t))for(var r=0,o=t.length;r<o;++r)n(e,t[r]);else n(e,t)}},125:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return e.charAt(0).toUpperCase()+e.slice(1)}},417:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return e instanceof Object&&!Array.isArray(e)}},379:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){if(e.hasOwnProperty(t)){for(var r={},i=e[t],a=(0,o.default)(t),l=Object.keys(n),u=0;u<l.length;u++){var s=l[u];if(s===t)for(var c=0;c<i.length;c++)r[i[c]+a]=n[t];r[s]=n[s]}return r}return n};var r,o=(r=n(125))&&r.__esModule?r:{default:r}},665:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,r,o){for(var i=0,a=e.length;i<a;++i){var l=e[i](t,n,r,o);if(l)return l}}},904:e=>{function t(e){var t;return"number"==typeof e?e>>>0===e&&e>=0&&e<=4294967295?e:null:(t=u.hex6.exec(e))?parseInt(t[1]+"ff",16)>>>0:p.hasOwnProperty(e)?p[e]:(t=u.rgb.exec(e))?(s(t[1])<<24|s(t[2])<<16|s(t[3])<<8|255)>>>0:(t=u.rgba.exec(e))?(s(t[1])<<24|s(t[2])<<16|s(t[3])<<8|d(t[4]))>>>0:(t=u.hex3.exec(e))?parseInt(t[1]+t[1]+t[2]+t[2]+t[3]+t[3]+"ff",16)>>>0:(t=u.hex8.exec(e))?parseInt(t[1],16)>>>0:(t=u.hex4.exec(e))?parseInt(t[1]+t[1]+t[2]+t[2]+t[3]+t[3]+t[4]+t[4],16)>>>0:(t=u.hsl.exec(e))?(255|r(c(t[1]),f(t[2]),f(t[3])))>>>0:(t=u.hsla.exec(e))?(r(c(t[1]),f(t[2]),f(t[3]))|d(t[4]))>>>0:null}function n(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+6*(t-e)*n:n<.5?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function r(e,t,r){var o=r<.5?r*(1+t):r+t-r*t,i=2*r-o,a=n(i,o,e+1/3),l=n(i,o,e),u=n(i,o,e-1/3);return Math.round(255*a)<<24|Math.round(255*l)<<16|Math.round(255*u)<<8}var o="[-+]?\\\\d*\\\\.?\\\\d+",i=o+"%";function a(e){return Array.prototype.slice.call(e,0)}function l(){return"\\\\(\\\\s*("+a(arguments).join(")\\\\s*,\\\\s*(")+")\\\\s*\\\\)"}var u={rgb:new RegExp("rgb"+l(o,o,o)),rgba:new RegExp("rgba"+l(o,o,o,o)),hsl:new RegExp("hsl"+l(o,i,i)),hsla:new RegExp("hsla"+l(o,i,i,o)),hex3:/^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex4:/^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#([0-9a-fA-F]{6})$/,hex8:/^#([0-9a-fA-F]{8})$/};function s(e){var t=parseInt(e,10);return t<0?0:t>255?255:t}function c(e){return(parseFloat(e)%360+360)%360/360}function d(e){var t=parseFloat(e);return t<0?0:t>1?255:Math.round(255*t)}function f(e){var t=parseFloat(e,10);return t<0?0:t>100?1:t/100}var p={transparent:0,aliceblue:4042850303,antiquewhite:4209760255,aqua:16777215,aquamarine:2147472639,azure:4043309055,beige:4126530815,bisque:4293182719,black:255,blanchedalmond:4293643775,blue:65535,blueviolet:2318131967,brown:2771004159,burlywood:3736635391,burntsienna:3934150143,cadetblue:1604231423,chartreuse:2147418367,chocolate:3530104575,coral:4286533887,cornflowerblue:1687547391,cornsilk:4294499583,crimson:3692313855,cyan:16777215,darkblue:35839,darkcyan:9145343,darkgoldenrod:3095792639,darkgray:2846468607,darkgreen:6553855,darkgrey:2846468607,darkkhaki:3182914559,darkmagenta:2332068863,darkolivegreen:1433087999,darkorange:4287365375,darkorchid:2570243327,darkred:2332033279,darksalmon:3918953215,darkseagreen:2411499519,darkslateblue:1211993087,darkslategray:793726975,darkslategrey:793726975,darkturquoise:13554175,darkviolet:2483082239,deeppink:4279538687,deepskyblue:12582911,dimgray:1768516095,dimgrey:1768516095,dodgerblue:512819199,firebrick:2988581631,floralwhite:4294635775,forestgreen:579543807,fuchsia:4278255615,gainsboro:3705462015,ghostwhite:4177068031,gold:4292280575,goldenrod:3668254975,gray:2155905279,green:8388863,greenyellow:2919182335,grey:2155905279,honeydew:4043305215,hotpink:4285117695,indianred:3445382399,indigo:1258324735,ivory:4294963455,khaki:4041641215,lavender:3873897215,lavenderblush:4293981695,lawngreen:2096890111,lemonchiffon:4294626815,lightblue:2916673279,lightcoral:4034953471,lightcyan:3774873599,lightgoldenrodyellow:4210742015,lightgray:3553874943,lightgreen:2431553791,lightgrey:3553874943,lightpink:4290167295,lightsalmon:4288707327,lightseagreen:548580095,lightskyblue:2278488831,lightslategray:2005441023,lightslategrey:2005441023,lightsteelblue:2965692159,lightyellow:4294959359,lime:16711935,limegreen:852308735,linen:4210091775,magenta:4278255615,maroon:2147483903,mediumaquamarine:1724754687,mediumblue:52735,mediumorchid:3126187007,mediumpurple:2473647103,mediumseagreen:1018393087,mediumslateblue:2070474495,mediumspringgreen:16423679,mediumturquoise:1221709055,mediumvioletred:3340076543,midnightblue:421097727,mintcream:4127193855,mistyrose:4293190143,moccasin:4293178879,navajowhite:4292783615,navy:33023,oldlace:4260751103,olive:2155872511,olivedrab:1804477439,orange:4289003775,orangered:4282712319,orchid:3664828159,palegoldenrod:4008225535,palegreen:2566625535,paleturquoise:2951671551,palevioletred:3681588223,papayawhip:4293907967,peachpuff:4292524543,peru:3448061951,pink:4290825215,plum:3718307327,powderblue:2967529215,purple:2147516671,rebeccapurple:1714657791,red:4278190335,rosybrown:3163525119,royalblue:1097458175,saddlebrown:2336560127,salmon:4202722047,sandybrown:4104413439,seagreen:780883967,seashell:4294307583,sienna:2689740287,silver:3233857791,skyblue:2278484991,slateblue:1784335871,slategray:1887473919,slategrey:1887473919,snow:4294638335,springgreen:16744447,steelblue:1182971135,tan:3535047935,teal:8421631,thistle:3636451583,tomato:4284696575,turquoise:1088475391,violet:4001558271,wheat:4125012991,white:4294967295,whitesmoke:4126537215,yellow:4294902015,yellowgreen:2597139199};t.rgba=function(e){return{r:Math.round((4278190080&e)>>>24),g:Math.round((16711680&e)>>>16),b:Math.round((65280&e)>>>8),a:((255&e)>>>0)/255}},e.exports=t}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,n),i.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};(()=>{"use strict";n.r(r),n.d(r,{Button:()=>vr,Checkbox:()=>mo,Container:()=>vo,Image:()=>yo,ImageBackground:()=>So,List:()=>go,Screen:()=>Ar,Stack:()=>bo,Text:()=>xr,TextInput:()=>jr});const e=window.React;var t=n.n(e);function o(e){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o(e)}function i(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){t.forEach((function(t){null!=t&&("function"!=typeof t?"object"!==o(t)?console.error("mergeRefs cannot handle Refs of type boolean, number or string, received ref "+String(t)):t.current=e:t(e))}))}}function a(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return e.useMemo((function(){return i.apply(void 0,n)}),[].concat(n))}var l="DELAY",u="ERROR",s="LONG_PRESS_DETECTED",c="NOT_RESPONDER",d="RESPONDER_ACTIVE_LONG_PRESS_START",f="RESPONDER_ACTIVE_PRESS_START",p="RESPONDER_INACTIVE_PRESS_START",v="RESPONDER_RELEASE",g="RESPONDER_TERMINATED",h=Object.freeze({NOT_RESPONDER:{DELAY:u,RESPONDER_GRANT:p,RESPONDER_RELEASE:u,RESPONDER_TERMINATED:u,LONG_PRESS_DETECTED:u},RESPONDER_INACTIVE_PRESS_START:{DELAY:f,RESPONDER_GRANT:u,RESPONDER_RELEASE:c,RESPONDER_TERMINATED:c,LONG_PRESS_DETECTED:u},RESPONDER_ACTIVE_PRESS_START:{DELAY:u,RESPONDER_GRANT:u,RESPONDER_RELEASE:c,RESPONDER_TERMINATED:c,LONG_PRESS_DETECTED:d},RESPONDER_ACTIVE_LONG_PRESS_START:{DELAY:u,RESPONDER_GRANT:u,RESPONDER_RELEASE:c,RESPONDER_TERMINATED:c,LONG_PRESS_DETECTED:d},ERROR:{DELAY:c,RESPONDER_GRANT:p,RESPONDER_RELEASE:c,RESPONDER_TERMINATED:c,LONG_PRESS_DETECTED:c}}),m=function(e){return e===f||e===d},b=function(e){return"button"===e.getAttribute("role")},y=function(e){return e===p||e===f||e===d},S=function(e){var t=e.key,n=e.target.getAttribute("role");return"Enter"===t||(" "===t||"Spacebar"===t)&&"button"===n},R=function(){function e(e){this._eventHandlers=null,this._isPointerTouch=!1,this._longPressDelayTimeout=null,this._longPressDispatched=!1,this._pressDelayTimeout=null,this._pressOutDelayTimeout=null,this._touchState=c,this.configure(e)}var t=e.prototype;return t.configure=function(e){this._config=e},t.reset=function(){this._cancelLongPressDelayTimeout(),this._cancelPressDelayTimeout(),this._cancelPressOutDelayTimeout()},t.getEventHandlers=function(){return null==this._eventHandlers&&(this._eventHandlers=this._createEventHandlers()),this._eventHandlers},t._createEventHandlers=function(){var e=this,t=function(t,n){t.persist(),e._cancelPressOutDelayTimeout(),e._longPressDispatched=!1,e._selectionTerminated=!1,e._touchState=c,e._isPointerTouch="touchstart"===t.nativeEvent.type,e._receiveSignal("RESPONDER_GRANT",t);var r=w(e._config.delayPressStart,0,50);!1!==n&&r>0?e._pressDelayTimeout=setTimeout((function(){e._receiveSignal(l,t)}),r):e._receiveSignal(l,t);var o=w(e._config.delayLongPress,10,450);e._longPressDelayTimeout=setTimeout((function(){e._handleLongPress(t)}),o+r)},n=function(t){e._receiveSignal(v,t)},r=function t(r){var o=e._config.onPress,i=r.target;if(e._touchState!==c&&S(r)){n(r),document.removeEventListener("keyup",t);var a=i.getAttribute("role"),l=i.tagName.toLowerCase();null==o||"link"===a||"a"===l||"button"===l||"input"===l||"select"===l||"textarea"===l||o(r)}};return{onStartShouldSetResponder:function(t){var n=e._config.disabled;return n&&b(t.currentTarget)&&t.stopPropagation(),null==n||!n},onKeyDown:function(n){var o=e._config.disabled,i=n.key,a=n.target;if(!o&&S(n)){e._touchState===c&&(t(n,!1),document.addEventListener("keyup",r));var l=a.getAttribute("role");(" "===i||"Spacebar"===i)&&("button"===l||"menuitem"===l)&&n.preventDefault(),n.stopPropagation()}},onResponderGrant:function(e){return t(e)},onResponderMove:function(t){null!=e._config.onPressMove&&e._config.onPressMove(t);var n=x(t);if(null!=e._touchActivatePosition){var r=e._touchActivatePosition.pageX-n.pageX,o=e._touchActivatePosition.pageY-n.pageY;Math.hypot(r,o)>10&&e._cancelLongPressDelayTimeout()}},onResponderRelease:function(e){return n(e)},onResponderTerminate:function(t){"selectionchange"===t.nativeEvent.type&&(e._selectionTerminated=!0),e._receiveSignal(g,t)},onResponderTerminationRequest:function(t){var n=e._config,r=n.cancelable,o=n.disabled,i=n.onLongPress;return!(!o&&null!=i&&e._isPointerTouch&&"contextmenu"===t.nativeEvent.type)&&(null==r||r)},onClick:function(t){var n=e._config,r=n.disabled,o=n.onPress;r?b(t.currentTarget)&&t.stopPropagation():(t.stopPropagation(),e._longPressDispatched||e._selectionTerminated?t.preventDefault():null!=o&&!1===t.altKey&&o(t))},onContextMenu:function(t){var n=e._config,r=n.disabled,o=n.onLongPress;r?b(t.currentTarget)&&t.stopPropagation():null!=o&&e._isPointerTouch&&!t.defaultPrevented&&(t.preventDefault(),t.stopPropagation())}}},t._receiveSignal=function(e,t){var n=this._touchState,r=null;null!=h[n]&&(r=h[n][e]),this._touchState===c&&e===v||(null==r||r===u?console.error("PressResponder: Invalid signal "+e+" for state "+n+" on responder"):n!==r&&(this._performTransitionSideEffects(n,r,e,t),this._touchState=r))},t._performTransitionSideEffects=function(e,t,n,r){if(function(e){return e===g||e===v}(n)&&(this._isPointerTouch=!1,this._touchActivatePosition=null,this._cancelLongPressDelayTimeout()),y(e)&&n===s){var o=this._config.onLongPress;null!=o&&null==r.nativeEvent.key&&(o(r),this._longPressDispatched=!0)}var i=m(e),a=m(t);if(!i&&a?this._activate(r):i&&!a&&this._deactivate(r),y(e)&&n===v){var l=this._config,u=l.onLongPress;null!=l.onPress&&(null!=u&&e===d||a||i||(this._activate(r),this._deactivate(r)))}this._cancelPressDelayTimeout()},t._activate=function(e){var t=this._config,n=t.onPressChange,r=t.onPressStart,o=x(e);this._touchActivatePosition={pageX:o.pageX,pageY:o.pageY},null!=r&&r(e),null!=n&&n(!0)},t._deactivate=function(e){var t=this._config,n=t.onPressChange,r=t.onPressEnd;function o(){null!=r&&r(e),null!=n&&n(!1)}var i=w(this._config.delayPressEnd);i>0?this._pressOutDelayTimeout=setTimeout((function(){o()}),i):o()},t._handleLongPress=function(e){this._touchState!==f&&this._touchState!==d||this._receiveSignal(s,e)},t._cancelLongPressDelayTimeout=function(){null!=this._longPressDelayTimeout&&(clearTimeout(this._longPressDelayTimeout),this._longPressDelayTimeout=null)},t._cancelPressDelayTimeout=function(){null!=this._pressDelayTimeout&&(clearTimeout(this._pressDelayTimeout),this._pressDelayTimeout=null)},t._cancelPressOutDelayTimeout=function(){null!=this._pressOutDelayTimeout&&(clearTimeout(this._pressOutDelayTimeout),this._pressOutDelayTimeout=null)},e}();function w(e,t,n){return void 0===t&&(t=0),void 0===n&&(n=0),Math.max(t,null!=e?e:n)}function x(e){var t=e.nativeEvent,n=t.changedTouches,r=t.touches;return null!=r&&r.length>0?r[0]:null!=n&&n.length>0?n[0]:e.nativeEvent}var E=n(657),O={},C={},k=1,P=function(e){return"r-"+e},T=function(){function e(){}return e.register=function(e){var t=k++,n=P(t);return C[n]=e,t},e.getByID=function(e){if(!e)return O;var t=P(e);return C[t]||(console.warn("Invalid style with id `"+e+"`. Skipping ..."),O)},e}(),_=n(660),D=n.n(_);const L=function e(t){if(t){if(!Array.isArray(t))return function(e){return"number"==typeof e?T.getByID(e):e}(t);for(var n={},r=0,o=t.length;r<o;++r){var i=e(t[r]);if(i)for(var a in i){var l=i[a];n[a]=l}}return n}};var j={position:"absolute",left:0,right:0,top:0,bottom:0},A={absoluteFill:T.register(j),absoluteFillObject:j,compose:function(e,t){return e&&t?[e,t]:e||t},create:function(e){var t={};return Object.keys(e).forEach((function(n){var r=e[n]&&T.register(e[n]);t[n]=r})),t},flatten:L,hairlineWidth:1};const M=A;E.canUseDOM&&window.__REACT_DEVTOOLS_GLOBAL_HOOK__&&(window.__REACT_DEVTOOLS_GLOBAL_HOOK__.resolveRNStyle=M.flatten);const I=M;var N={adjustable:"slider",button:"button",header:"heading",image:"img",imagebutton:null,keyboardkey:null,label:null,link:"link",none:"presentation",search:"search",summary:"region",text:null};const B=function(e){var t=e.accessibilityRole;if(t){var n=N[t];if(null!==n)return n||t}};var W={article:"article",banner:"header",blockquote:"blockquote",code:"code",complementary:"aside",contentinfo:"footer",deletion:"del",emphasis:"em",figure:"figure",insertion:"ins",form:"form",list:"ul",listitem:"li",main:"main",navigation:"nav",region:"section",strong:"strong"},z={};const F=function(e){if(void 0===e&&(e=z),"label"===e.accessibilityRole)return"label";var t=B(e);if(t){if("heading"===t){var n=e.accessibilityLevel||e["aria-level"];return null!=n?"h"+n:"h1"}return W[t]}},G=B;var Y={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,flex:!0,flexGrow:!0,flexOrder:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,fontWeight:!0,gridRow:!0,gridRowEnd:!0,gridRowGap:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnGap:!0,gridColumnStart:!0,lineClamp:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0,scale:!0,scaleX:!0,scaleY:!0,scaleZ:!0,shadowOpacity:!0},X=["ms","Moz","O","Webkit"];Object.keys(Y).forEach((function(e){X.forEach((function(t){Y[function(e,t){return e+t.charAt(0).toUpperCase()+t.substring(1)}(t,e)]=Y[e]}))}));const H=Y;var V=n(904),Z=n.n(V);const K=function(e,t){if(void 0===t&&(t=1),null!=e){if("string"==typeof e&&function(e){return"currentcolor"===e||"currentColor"===e||"inherit"===e||0===e.indexOf("var(")}(e))return e;var n=function(e){if(null==e)return e;var t=Z()(e);return null!=t?t=(t<<24|t>>>8)>>>0:void 0}(e);if(null!=n)return"rgba("+(n>>16&255)+","+(n>>8&255)+","+(255&n)+","+((n>>24&255)/255*t).toFixed(2)+")"}};var q={backgroundColor:!0,borderColor:!0,borderTopColor:!0,borderRightColor:!0,borderBottomColor:!0,borderLeftColor:!0,color:!0,shadowColor:!0,textDecorationColor:!0,textShadowColor:!0};function U(e,t){var n=e;return null!=t&&H[t]||"number"!=typeof e?null!=t&&q[t]&&(n=K(e)):n=e+"px",n}var $={height:0,width:0};const J=function(e){var t=e.shadowColor,n=e.shadowOffset,r=e.shadowOpacity,o=e.shadowRadius,i=n||$,a=i.height,l=U(i.width),u=U(a),s=U(o||0),c=K(t||"black",r);if(null!=c&&null!=l&&null!=u&&null!=s)return l+" "+u+" "+s+" "+c};var Q={height:0,width:0};const ee=function(e){var t,n,r,o,i=e.shadowColor,a=e.shadowOffset,l=e.shadowOpacity,u=e.shadowRadius,s=e.textShadowColor,c=e.textShadowOffset,d=e.textShadowRadius,f=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,["shadowColor","shadowOffset","shadowOpacity","shadowRadius","textShadowColor","textShadowOffset","textShadowRadius"]);return null==i&&null==a&&null==l&&null==u||(t=f,r=(n=e).boxShadow,null!=(o=J(n))&&(t.boxShadow=r?r+", "+o:o)),null==s&&null==c&&null==d||function(e,t){var n=t.textShadowColor,r=t.textShadowOffset,o=t.textShadowRadius,i=r||Q,a=i.height,l=i.width,u=o||0,s=U(l),c=U(a),d=U(u),f=U(n,"textShadowColor");!f||0===a&&0===l&&0===u||null==s||null==c||null==d||(e.textShadow=s+" "+c+" "+d+" "+f)}(f,e),f};var te=Array.prototype.slice;function ne(e){return Object.keys(e).map(Number).sort((function(e,t){return e>t?1:-1}))}var re=/\\s*([,])\\s*/g;function oe(e){var t=e.split("{")[0].trim();return""!==t?t.replace(re,"$1"):null}const ie=function(e){return function e(t,n){for(var r=0;r<t.length;r++){var o=t[r];Array.isArray(o)?e(o,n):null!=o&&!1!==o&&n.push(o)}return n}(e,[])};var ae=!0,le=!1,ue=!0,se=!1,ce=function(){return!!se||ue&&le};const de=function(){return{doLeftAndRightSwapInRTL:ae,isRTL:ce()}};var fe=/^[+-]?\\d*(?:\\.\\d+)?(?:[Ee][+-]?\\d+)?(%|\\w*)/;var pe={},ve="borderTopLeftRadius",ge="borderTopRightRadius",he="borderBottomLeftRadius",me="borderBottomRightRadius",be="borderLeftColor",ye="borderLeftStyle",Se="borderLeftWidth",Re="borderRightColor",we="borderRightStyle",xe="borderRightWidth",Ee="right",Oe="marginLeft",Ce="marginRight",ke="paddingLeft",Pe="paddingRight",Te="left",_e={borderTopLeftRadius:ge,borderTopRightRadius:ve,borderBottomLeftRadius:me,borderBottomRightRadius:he,borderLeftColor:Re,borderLeftStyle:we,borderLeftWidth:xe,borderRightColor:be,borderRightStyle:ye,borderRightWidth:Se,left:Ee,marginLeft:Ce,marginRight:Oe,paddingLeft:Pe,paddingRight:ke,right:Te},De={borderTopStartRadius:ve,borderTopEndRadius:ge,borderBottomStartRadius:he,borderBottomEndRadius:me,borderStartColor:be,borderStartStyle:ye,borderStartWidth:Se,borderEndColor:Re,borderEndStyle:we,borderEndWidth:xe,end:Ee,marginStart:Oe,marginEnd:Ce,paddingStart:ke,paddingEnd:Pe,start:Te},Le={clear:!0,float:!0,textAlign:!0},je=function(e){return function(e,t){var n;return"string"==typeof e?""+parseFloat(e)*t+e.match(fe)[1]:(n=e,!isNaN(parseFloat(n))&&isFinite(n)?e*t:void 0)}(e,-1)};const Ae=function(e){var t=de(),n=t.doLeftAndRightSwapInRTL,r=t.isRTL,o=e||pe,i={},a={};for(var l in o)if(Object.prototype.hasOwnProperty.call(o,l)){var u=o[l],s=l,c=u;if(De.hasOwnProperty(l)){var d=De[l];s=r?_e[d]:d}else r&&n&&_e[l]&&(s=_e[l]);if(Le.hasOwnProperty(l)&&("start"===u?c=r?"right":"left":"end"===u?c=r?"left":"right":r&&n&&("left"===u?c="right":"right"===u&&(c="left"))),"transitionProperty"===s)if(De.hasOwnProperty(c)){var f=De[u];c=r?_e[f]:f}else if(r&&n){var p=_e[u];null!=p&&(c=p)}if(r&&"textShadowOffset"===s){var v=je(c.width);c.width=v,a[s]=c}else i[s]||(a[s]=c);De[l]&&(i[s]=!0)}return a};var Me="react-native-stylesheet",Ie={reset:0,modality:.1,classicReset:.5,classic:1,atomic:2.2,custom:{borderColor:2,borderRadius:2,borderStyle:2,borderWidth:2,display:2,flex:2,margin:2,overflow:2,overscrollBehavior:2,padding:2,marginHorizontal:2.1,marginVertical:2.1,paddingHorizontal:2.1,paddingVertical:2.1}},Ne={borderColor:["borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"],borderRadius:["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],borderStyle:["borderTopStyle","borderRightStyle","borderBottomStyle","borderLeftStyle"],borderWidth:["borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth"],margin:["marginTop","marginRight","marginBottom","marginLeft"],marginHorizontal:["marginRight","marginLeft"],marginVertical:["marginTop","marginBottom"],overflow:["overflowX","overflowY"],overscrollBehavior:["overscrollBehaviorX","overscrollBehaviorY"],padding:["paddingTop","paddingRight","paddingBottom","paddingLeft"],paddingHorizontal:["paddingRight","paddingLeft"],paddingVertical:["paddingTop","paddingBottom"]},Be=\'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif\',We={},ze=!E.canUseDOM||null!=window.CSS&&null!=window.CSS.supports&&(window.CSS.supports("text-decoration-line","none")||window.CSS.supports("-webkit-text-decoration-line","none")),Fe=function(e){var t=Object.keys(e)[0],n=e[t];return"matrix"===t||"matrix3d"===t?t+"("+n.join(",")+")":t+"("+U(n,t)+")"};const Ge=function(e){if(!e)return We;var t={};return Object.keys(e).sort().forEach((function(n){var r=U(e[n],n);if(null!=r)switch(n){case"elevation":case"overlayColor":case"resizeMode":case"tintColor":break;case"aspectRatio":t[n]=r.toString();break;case"backgroundClip":"text"===r&&(t.backgroundClip=r,t.WebkitBackgroundClip=r);break;case"flex":-1===r?(t.flexGrow=0,t.flexShrink=1,t.flexBasis="auto"):t.flex=r;break;case"font":t[n]=r.replace("System",Be);break;case"fontFamily":if(r.indexOf("System")>-1){var o=r.split(/,\\s*/);o[o.indexOf("System")]=Be,t[n]=o.join(",")}else t[n]="monospace"===r?"monospace,monospace":r;break;case"fontVariant":Array.isArray(r)&&r.length>0&&(t.fontVariant=r.join(" "));break;case"textAlignVertical":t.verticalAlign="center"===r?"middle":r;break;case"textDecorationLine":ze?t.textDecorationLine=r:t.textDecoration=r;break;case"transform":case"transformMatrix":!function(e,t){var n=t.transform;Array.isArray(t.transform)&&(n=t.transform.map(Fe).join(" ")),e.transform=n}(t,e);break;case"writingDirection":t.direction=r;break;default:var i=Ne[n];i?i.forEach((function(n,o){void 0===e[n]&&(t[n]=r)})):t[n]=Array.isArray(r)?r.join(","):r}})),t};var Ye=n(196),Xe=n(205),He=n(477),Ve=n(122),Ze=n(461),Ke=n(411),qe=n(911),Ue=n(201),$e=n(512),Je=n(543),Qe=n(670),et=n(585),tt=n(594),nt=n(494),rt=n(989),ot=n(832),it=["Webkit"],at=["Moz"],lt=["ms"],ut=["Webkit","Moz"],st=["Webkit","ms"],ct=["Webkit","Moz","ms"];const dt={plugins:[He.Z,Ve.Z,Ze.Z,Ke.Z,qe.Z,Ue.Z,$e.Z,Je.Z,Qe.Z,et.Z,tt.Z,nt.Z,rt.Z,ot.Z],prefixMap:{animation:it,animationDelay:it,animationDirection:it,animationFillMode:it,animationDuration:it,animationIterationCount:it,animationName:it,animationPlayState:it,animationTimingFunction:it,appearance:ut,userSelect:ct,textEmphasisPosition:it,textEmphasis:it,textEmphasisStyle:it,textEmphasisColor:it,boxDecorationBreak:it,clipPath:it,maskImage:it,maskMode:it,maskRepeat:it,maskPosition:it,maskClip:it,maskOrigin:it,maskSize:it,maskComposite:it,mask:it,maskBorderSource:it,maskBorderMode:it,maskBorderSlice:it,maskBorderWidth:it,maskBorderOutset:it,maskBorderRepeat:it,maskBorder:it,maskType:it,textDecorationStyle:it,textDecorationSkip:it,textDecorationLine:it,textDecorationColor:it,filter:it,fontFeatureSettings:it,breakAfter:ct,breakBefore:ct,breakInside:ct,columnCount:ut,columnFill:ut,columnGap:ut,columnRule:ut,columnRuleColor:ut,columnRuleStyle:ut,columnRuleWidth:ut,columns:ut,columnSpan:ut,columnWidth:ut,writingMode:st,flex:st,flexBasis:it,flexDirection:st,flexGrow:it,flexFlow:st,flexShrink:it,flexWrap:st,alignContent:it,alignItems:it,alignSelf:it,justifyContent:it,order:it,transform:it,transformOrigin:it,transformOriginX:it,transformOriginY:it,backfaceVisibility:it,perspective:it,perspectiveOrigin:it,transformStyle:it,transformOriginZ:it,backdropFilter:it,fontKerning:it,scrollSnapType:st,scrollSnapPointsX:st,scrollSnapPointsY:st,scrollSnapDestination:st,scrollSnapCoordinate:st,shapeImageThreshold:it,shapeImageMargin:it,shapeImageOutside:it,hyphens:ct,flowInto:st,flowFrom:st,regionFragment:st,textOrientation:it,textAlignLast:at,tabSize:at,wrapFlow:lt,wrapThrough:lt,wrapMargin:lt,touchAction:lt,textSizeAdjust:["ms","Webkit"],borderImage:it,borderImageOutset:it,borderImageRepeat:it,borderImageSlice:it,borderImageSource:it,borderImageWidth:it,transitionDelay:it,transitionDuration:it,transitionProperty:it,transitionTimingFunction:it}};var ft=(0,Xe.Z)(dt);const pt=ft;function vt(e){return vt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},vt(e)}function gt(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function ht(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?gt(Object(n),!0).forEach((function(t){mt(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):gt(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function mt(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var bt={get:function(e,t){if(null!=bt[e]&&bt[e].hasOwnProperty(t)&&null!=bt[e][t])return bt[e][t]},set:function(e,t,n){return null==bt[e]&&(bt[e]={}),bt[e][t]=n}};function yt(e){return Object.keys(e).sort().reduce((function(t,n){var r=e[n];if(null!=r){var o=St(r,n),i=bt.get(n,o);if(null!=i)t[i.identifier]=i;else{var a=wt("r",n,r),l=function(e,t,n){var r=[],o="."+e;switch(t){case"animationKeyframes":var i=xt(n),a=i.animationNames,l=i.rules,u=Rt({animationName:a.join(",")});r.push.apply(r,[""+o+u].concat(l));break;case"placeholderTextColor":var s=Rt({color:n,opacity:1});r.push(o+"::-webkit-input-placeholder"+s,o+"::-moz-placeholder"+s,o+":-ms-input-placeholder"+s,o+"::placeholder"+s);break;case"pointerEvents":var c=n;if("auto"===n||"box-only"===n){if(c="auto!important","box-only"===n){var d=Rt({pointerEvents:"none"});r.push(o+">*"+d)}}else if(("none"===n||"box-none"===n)&&(c="none!important","box-none"===n)){var f=Rt({pointerEvents:"auto"});r.push(o+">*"+f)}var p=Rt({pointerEvents:c});r.push(""+o+p);break;case"scrollbarWidth":"none"===n&&r.push(o+"::-webkit-scrollbar{display:none}");var v=Rt({scrollbarWidth:n});r.push(""+o+v);break;default:var g,h=Rt(((g={})[t]=n,g));r.push(""+o+h)}return r}(a,n,r),u=bt.set(n,o,{property:n,value:St(r,n),identifier:a,rules:l});t[a]=u}}return t}),{})}function St(e,t){var n=U(e,t);return"string"!=typeof n?JSON.stringify(n||""):n}function Rt(e){var t=pt(Ge(e));return"{"+Object.keys(t).map((function(e){var n=t[e],r=(0,Ye.default)(e);return Array.isArray(n)?n.map((function(e){return r+":"+e})).join(";"):r+":"+n})).sort().join(";")+";}"}function wt(e,t,n){return e+"-"+function(e,t){for(var n,r=e.length,o=1^r,i=0;r>=4;)n=1540483477*(65535&(n=255&e.charCodeAt(i)|(255&e.charCodeAt(++i))<<8|(255&e.charCodeAt(++i))<<16|(255&e.charCodeAt(++i))<<24))+((1540483477*(n>>>16)&65535)<<16),o=1540483477*(65535&o)+((1540483477*(o>>>16)&65535)<<16)^(n=1540483477*(65535&(n^=n>>>24))+((1540483477*(n>>>16)&65535)<<16)),r-=4,++i;switch(r){case 3:o^=(255&e.charCodeAt(i+2))<<16;case 2:o^=(255&e.charCodeAt(i+1))<<8;case 1:o=1540483477*(65535&(o^=255&e.charCodeAt(i)))+((1540483477*(o>>>16)&65535)<<16)}return o=1540483477*(65535&(o^=o>>>13))+((1540483477*(o>>>16)&65535)<<16),(o^=o>>>15)>>>0}(t+St(n,t)).toString(36)}function xt(e){if("number"==typeof e)throw new Error("Invalid CSS keyframes type: "+vt(e));var t=[],n=[];return(Array.isArray(e)?e:[e]).forEach((function(e){if("string"==typeof e)t.push(e);else{var r=function(e){var t=wt("r","animation",e),n="{"+Object.keys(e).map((function(t){return""+t+Rt(e[t])})).join("")+"}",r=["-webkit-",""].map((function(e){return"@"+e+"keyframes "+t+n}));return{identifier:t,rules:r}}(e),o=r.identifier,i=r.rules;t.push(o),n.push.apply(n,i)}})),{animationNames:t,rules:n}}const Et=["html{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0);}","body{margin:0;}","button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0;}","input::-webkit-search-cancel-button,input::-webkit-search-decoration,input::-webkit-search-results-button,input::-webkit-search-results-decoration{display:none;}"];var Ot="data-focusvisible-polyfill";var Ct=function(e){return"rn-"+e},kt=function(){var e,t,n,r={css:{},ltr:{},rtl:{},rtlNoSwap:{}},o=function(){e={css:{},ltr:{},rtl:{},rtlNoSwap:{}},t=function(e){var t,n={},r={};function o(e,t,r){var o=ne(n),i=o.indexOf(t)+1,a=o[i],l=null!=a&&null!=n[a].start?n[a].start:e.cssRules.length,u=function(e,t,n){try{return e.insertRule(t,n),!0}catch(e){return!1}}(e,r,l);if(u){null==n[t].start&&(n[t].start=l);for(var s=i;s<o.length;s+=1){var c=o[s],d=n[c].start||0;n[c].start=d+1}}return u}null!=e&&te.call(e.cssRules).forEach((function(e,o){var i=e.cssText;if(i.indexOf("stylesheet-group")>-1)t=function(e){return Number(e.selectorText.split(/["\']/)[1])}(e),n[t]={start:o,rules:[i]};else{var a=oe(i);null!=a&&(r[a]=!0,n[t].rules.push(i))}}));var i={getTextContent:function(){return ne(n).map((function(e){return n[e].rules.join("\\n")})).join("\\n")},insert:function(t,i){var a=Number(i);if(null==n[a]){var l=function(e){return\'[stylesheet-group="\'+e+\'"]{}\'}(a);n[a]={start:null,rules:[l]},null!=e&&o(e,a,l)}var u=oe(t);null!=u&&null==r[u]&&(r[u]=!0,n[a].rules.push(t),null!=e&&(o(e,a,t)||n[a].rules.pop()))}};return i}(function(e){if(E.canUseDOM){var t=document.getElementById(e);if(null!=t)return t.sheet;var n=document.createElement("style");n.setAttribute("id",e);var r=document.head;return r&&r.insertBefore(n,r.firstChild),n.sheet}return null}(Me)),n={},function(e){if(e(":focus:not([data-focusvisible-polyfill]){outline: none;}"),E.canUseDOM){var t=!0,n=!1,r=null,o={text:!0,search:!0,url:!0,tel:!0,email:!0,password:!0,number:!0,date:!0,month:!0,week:!0,time:!0,datetime:!0,"datetime-local":!0};document.addEventListener("keydown",(function(e){"Tab"!==e.key&&(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)||(i(document.activeElement)&&a(document.activeElement),t=!0)}),!0),document.addEventListener("mousedown",u,!0),document.addEventListener("pointerdown",u,!0),document.addEventListener("touchstart",u,!0),document.addEventListener("focus",(function(e){var n,r,l,u;i(e.target)&&(t||(r=(n=e.target).type,l=n.tagName,u=n.readOnly,"INPUT"===l&&o[r]&&!u||"TEXTAREA"===l&&!u||n.isContentEditable))&&a(e.target)}),!0),document.addEventListener("blur",(function(e){i(e.target)&&e.target.hasAttribute(Ot)&&(n=!0,window.clearTimeout(r),r=window.setTimeout((function(){n=!1,window.clearTimeout(r)}),100),l(e.target))}),!0),document.addEventListener("visibilitychange",(function(e){"hidden"===document.visibilityState&&(n&&(t=!0),s())}),!0),s()}function i(e){return!!(e&&e!==document&&"HTML"!==e.nodeName&&"BODY"!==e.nodeName&&"classList"in e&&"contains"in e.classList)}function a(e){e.hasAttribute(Ot)||e.setAttribute(Ot,!0)}function l(e){e.removeAttribute(Ot)}function u(e){!0===t&&function(){for(var e=document.querySelectorAll("[data-focusvisible-polyfill]"),t=0;t<e.length;t+=1)l(e[t])}(),t=!1}function s(){document.addEventListener("mousemove",c),document.addEventListener("mousedown",c),document.addEventListener("mouseup",c),document.addEventListener("pointermove",c),document.addEventListener("pointerdown",c),document.addEventListener("pointerup",c),document.addEventListener("touchmove",c),document.addEventListener("touchstart",c),document.addEventListener("touchend",c)}function c(e){"HTML"!==e.target.nodeName&&(t=!1,document.removeEventListener("mousemove",c),document.removeEventListener("mousedown",c),document.removeEventListener("mouseup",c),document.removeEventListener("pointermove",c),document.removeEventListener("pointerdown",c),document.removeEventListener("pointerup",c),document.removeEventListener("touchmove",c),document.removeEventListener("touchstart",c),document.removeEventListener("touchend",c))}}((function(e){return t.insert(e,Ie.modality)})),Et.forEach((function(e){t.insert(e,Ie.reset)}))};function i(r){var o=de(),i=o.doLeftAndRightSwapInRTL,a=o.isRTL?i?"rtl":"rtlNoSwap":"ltr";if(!e[a][r]){var l=yt(ee(Ae(L(r))));Object.keys(l).forEach((function(e){var r=l[e],o=r.identifier,i=r.property,a=r.rules,u=r.value;!function(e,t,r){n[t]||(n[t]={}),n[t][r]=e}(o,i,u),a.forEach((function(e){var n=Ie.custom[i]||Ie.atomic;t.insert(e,n)}))})),e[a][r]=!0}}function a(e,o){var i=de(),a=i.doLeftAndRightSwapInRTL,l=i.isRTL?a?"rtl":"rtlNoSwap":"ltr";if(null!=o&&null!=r[l][o])return r[l][o];var u=L(e),s=ee(Ae(u)),c=Object.keys(s).sort().reduce((function(e,r){var o=s[r];if(null!=o){var i=function(e,t){var r=St(t,e);return n[e]&&n[e].hasOwnProperty(r)&&n[e][r]}(r,o);if(i)e.classList.push(i);else if("animationKeyframes"===r||"placeholderTextColor"===r||"pointerEvents"===r||"scrollbarWidth"===r){var a,l=yt(((a={})[r]=o,a));Object.keys(l).forEach((function(n){var r=l[n],o=r.identifier,i=r.rules;e.classList.push(o),i.forEach((function(e){t.insert(e,Ie.atomic)}))}))}else e.style||(e.style={}),e.style[r]=o}return e}),{classList:[]});return c.style&&(c.style=function(e){return function(e){var t=ft(e);return Object.keys(t).forEach((function(e){var n=t[e];Array.isArray(n)&&(t[e]=n[n.length-1])})),t}(Ge(e))}(c.style)),null!=o&&(r[l][o]=c),c}return o(),{getStyleSheet:function(){var e=t.getTextContent();return E.canUseDOM||o(),{id:Me,textContent:e}},createCSS:function(e,t){var n={};return Object.keys(e).forEach((function(o){var i=function(e,t){var n,r,o=wt("css",t,e),i=e.animationKeyframes,a=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,["animationKeyframes"]),l=[],u="."+o;if(null!=i){var s=xt(i),c=s.animationNames,d=s.rules;r=c.join(","),l.push.apply(l,d)}var f=Rt(ht(ht({},a),{},{animationName:r}));return l.push(""+u+f),(n={})[o]={identifier:o,rules:l},n}(e[o],o);Object.keys(i).forEach((function(e){var a=i[e],l=a.identifier,u=a.rules;r.css[l]={group:t||Ie.classic,rules:u},n[o]=l}))})),n},resolve:function(n,o){var l=[],u={};if(!n&&!o)return u;if(Array.isArray(o)&&ie(o).forEach((function(n){if(n){if(null==e.css[n]&&null!=r.css[n]){var o=r.css[n];o.rules.forEach((function(e){t.insert(e,o.group)})),e.css[n]=!0}l.push(n)}})),"number"==typeof n)i(n),u=a(n,Ct(n));else if(Array.isArray(n)){for(var s=ie(n),c=!0,d="",f=0;f<s.length;f++){var p=s[f];"number"!=typeof p?c=!1:(c&&(d+=p+"-"),i(p))}u=a(s,c?Ct(d):null)}else u=a(n);l.push.apply(l,u.classList);var v,g={className:(v=l,v.join(" ").trim()),classList:l};return u.style&&(g.style=u.style),g},get sheet(){return t}}}();const Pt=kt,Tt=function(e,t){return Pt.createCSS(e,t)};var _t={},Dt=Object.prototype.hasOwnProperty,Lt=Array.isArray,jt=/[A-Z]/g;function At(e){return"-"+e.toLowerCase()}function Mt(e){return Lt(e)?e.join(" "):e}var It=Tt({reset:{backgroundColor:"transparent",color:"inherit",font:"inherit",listStyle:"none",margin:0,textAlign:"inherit",textDecoration:"none"},cursor:{cursor:"pointer"}},Ie.classicReset),Nt=I.create({auto:{pointerEvents:"auto"},"box-none":{pointerEvents:"box-none"},"box-only":{pointerEvents:"box-only"},none:{pointerEvents:"none"}});const Bt=function(e,t){t||(t=_t);var n=t,r=n.accessibilityActiveDescendant,o=n.accessibilityAtomic,i=n.accessibilityAutoComplete,a=n.accessibilityBusy,l=n.accessibilityChecked,u=n.accessibilityColumnCount,s=n.accessibilityColumnIndex,c=n.accessibilityColumnSpan,d=n.accessibilityControls,f=n.accessibilityCurrent,p=n.accessibilityDescribedBy,v=n.accessibilityDetails,g=n.accessibilityDisabled,h=n.accessibilityErrorMessage,m=n.accessibilityExpanded,b=n.accessibilityFlowTo,y=n.accessibilityHasPopup,S=n.accessibilityHidden,R=n.accessibilityInvalid,w=n.accessibilityKeyShortcuts,x=n.accessibilityLabel,E=n.accessibilityLabelledBy,O=n.accessibilityLevel,C=n.accessibilityLiveRegion,k=n.accessibilityModal,P=n.accessibilityMultiline,T=n.accessibilityMultiSelectable,_=n.accessibilityOrientation,D=n.accessibilityOwns,L=n.accessibilityPlaceholder,j=n.accessibilityPosInSet,A=n.accessibilityPressed,M=n.accessibilityReadOnly,N=n.accessibilityRequired,B=(n.accessibilityRole,n.accessibilityRoleDescription),W=n.accessibilityRowCount,z=n.accessibilityRowIndex,F=n.accessibilityRowSpan,Y=n.accessibilitySelected,X=n.accessibilitySetSize,H=n.accessibilitySort,V=n.accessibilityValueMax,Z=n.accessibilityValueMin,K=n.accessibilityValueNow,q=n.accessibilityValueText,U=n.classList,$=n.dataSet,J=n.focusable,Q=n.nativeID,ee=n.pointerEvents,te=n.style,ne=n.testID,re=n.accessible,oe=n.accessibilityState,ie=n.accessibilityValue,ae=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(n,["accessibilityActiveDescendant","accessibilityAtomic","accessibilityAutoComplete","accessibilityBusy","accessibilityChecked","accessibilityColumnCount","accessibilityColumnIndex","accessibilityColumnSpan","accessibilityControls","accessibilityCurrent","accessibilityDescribedBy","accessibilityDetails","accessibilityDisabled","accessibilityErrorMessage","accessibilityExpanded","accessibilityFlowTo","accessibilityHasPopup","accessibilityHidden","accessibilityInvalid","accessibilityKeyShortcuts","accessibilityLabel","accessibilityLabelledBy","accessibilityLevel","accessibilityLiveRegion","accessibilityModal","accessibilityMultiline","accessibilityMultiSelectable","accessibilityOrientation","accessibilityOwns","accessibilityPlaceholder","accessibilityPosInSet","accessibilityPressed","accessibilityReadOnly","accessibilityRequired","accessibilityRole","accessibilityRoleDescription","accessibilityRowCount","accessibilityRowIndex","accessibilityRowSpan","accessibilitySelected","accessibilitySetSize","accessibilitySort","accessibilityValueMax","accessibilityValueMin","accessibilityValueNow","accessibilityValueText","classList","dataSet","focusable","nativeID","pointerEvents","style","testID","accessible","accessibilityState","accessibilityValue"]),le=null!=oe&&!0===oe.disabled||g,ue=G(t);if(null!=oe)for(var se in oe){var ce=oe[se];null!=ce&&("disabled"===se||"hidden"===se?!0===ce&&(ae["aria-"+se]=ce,ae[se]=ce):ae["aria-"+se]=ce)}if(null!=ie)for(var de in ie){var fe=ie[de];null!=fe&&(ae["aria-value"+de]=fe)}if(null!=r&&(ae["aria-activedescendant"]=r),null!=o&&(ae["aria-atomic"]=o),null!=i&&(ae["aria-autocomplete"]=i),null!=a&&(ae["aria-busy"]=a),null!=l&&(ae["aria-checked"]=l),null!=u&&(ae["aria-colcount"]=u),null!=s&&(ae["aria-colindex"]=s),null!=c&&(ae["aria-colspan"]=c),null!=d&&(ae["aria-controls"]=Mt(d)),null!=f&&(ae["aria-current"]=f),null!=p&&(ae["aria-describedby"]=Mt(p)),null!=v&&(ae["aria-details"]=v),!0===le&&(ae["aria-disabled"]=!0,"button"!==e&&"form"!==e&&"input"!==e&&"select"!==e&&"textarea"!==e||(ae.disabled=!0)),null!=h&&(ae["aria-errormessage"]=h),null!=m&&(ae["aria-expanded"]=m),null!=b&&(ae["aria-flowto"]=Mt(b)),null!=y&&(ae["aria-haspopup"]=y),!0===S&&(ae["aria-hidden"]=S),null!=R&&(ae["aria-invalid"]=R),null!=w&&Array.isArray(w)&&(ae["aria-keyshortcuts"]=w.join(" ")),null!=x&&(ae["aria-label"]=x),null!=E&&(ae["aria-labelledby"]=Mt(E)),null!=O&&(ae["aria-level"]=O),null!=C&&(ae["aria-live"]="none"===C?"off":C),null!=k&&(ae["aria-modal"]=k),null!=P&&(ae["aria-multiline"]=P),null!=T&&(ae["aria-multiselectable"]=T),null!=_&&(ae["aria-orientation"]=_),null!=D&&(ae["aria-owns"]=Mt(D)),null!=L&&(ae["aria-placeholder"]=L),null!=j&&(ae["aria-posinset"]=j),null!=A&&(ae["aria-pressed"]=A),null!=M&&(ae["aria-readonly"]=M,"input"!==e&&"select"!==e&&"textarea"!==e||(ae.readOnly=!0)),null!=N&&(ae["aria-required"]=N,"input"!==e&&"select"!==e&&"textarea"!==e||(ae.required=!0)),null!=ue&&(ae.role="none"===ue?"presentation":ue),null!=B&&(ae["aria-roledescription"]=B),null!=W&&(ae["aria-rowcount"]=W),null!=z&&(ae["aria-rowindex"]=z),null!=F&&(ae["aria-rowspan"]=F),null!=Y&&(ae["aria-selected"]=Y),null!=X&&(ae["aria-setsize"]=X),null!=H&&(ae["aria-sort"]=H),null!=V&&(ae["aria-valuemax"]=V),null!=Z&&(ae["aria-valuemin"]=Z),null!=K&&(ae["aria-valuenow"]=K),null!=q&&(ae["aria-valuetext"]=q),null!=$)for(var pe in $)if(Dt.call($,pe)){var ve=pe.replace(jt,At),ge=$[pe];null!=ge&&(ae["data-"+ve]=ge)}var he=null!=J?J:re;!1===he&&(ae.tabIndex="-1"),"a"===e||"button"===e||"input"===e||"select"===e||"textarea"===e?!1!==he&&!0!==g||(ae.tabIndex="-1"):"button"===ue||"checkbox"===ue||"link"===ue||"radio"===ue||"textbox"===ue||"switch"===ue?!1!==he&&(ae.tabIndex="0"):!0===he&&(ae.tabIndex="0");var me=I.compose(ee&&Nt[ee],te),be=("button"===ue||"link"===ue)&&!le,ye=[("a"===e||"button"===e||"li"===e||"ul"===e||"heading"===ue)&&It.reset,be&&It.cursor,U],Se=Pt.resolve(me,ye),Re=Se.className,we=Se.style;return null!=Re&&""!==Re&&(ae.className=Re),we&&(ae.style=we),null!=Q&&(ae.id=Q),null!=ne&&(ae["data-testid"]=ne),ae},Wt=function(e,n){var r;e&&e.constructor===String&&(r=F(n));for(var o=r||e,i=Bt(o,n),a=arguments.length,l=new Array(a>2?a-2:0),u=2;u<a;u++)l[u-2]=arguments[u];return t().createElement.apply(t(),[o,i].concat(l))};var zt={children:!0,dataSet:!0,nativeID:!0,ref:!0,suppressHydrationWarning:!0,testID:!0},Ft={accessibilityActiveDescendant:!0,accessibilityAtomic:!0,accessibilityAutoComplete:!0,accessibilityBusy:!0,accessibilityChecked:!0,accessibilityColumnCount:!0,accessibilityColumnIndex:!0,accessibilityColumnSpan:!0,accessibilityControls:!0,accessibilityCurrent:!0,accessibilityDescribedBy:!0,accessibilityDetails:!0,accessibilityDisabled:!0,accessibilityErrorMessage:!0,accessibilityExpanded:!0,accessibilityFlowTo:!0,accessibilityHasPopup:!0,accessibilityHidden:!0,accessibilityInvalid:!0,accessibilityKeyShortcuts:!0,accessibilityLabel:!0,accessibilityLabelledBy:!0,accessibilityLevel:!0,accessibilityLiveRegion:!0,accessibilityModal:!0,accessibilityMultiline:!0,accessibilityMultiSelectable:!0,accessibilityOrientation:!0,accessibilityOwns:!0,accessibilityPlaceholder:!0,accessibilityPosInSet:!0,accessibilityPressed:!0,accessibilityReadOnly:!0,accessibilityRequired:!0,accessibilityRole:!0,accessibilityRoleDescription:!0,accessibilityRowCount:!0,accessibilityRowIndex:!0,accessibilityRowSpan:!0,accessibilitySelected:!0,accessibilitySetSize:!0,accessibilitySort:!0,accessibilityValueMax:!0,accessibilityValueMin:!0,accessibilityValueNow:!0,accessibilityValueText:!0,dir:!0,focusable:!0,accessible:!0,accessibilityState:!0,accessibilityValue:!0},Gt={onClick:!0,onClickCapture:!0,onContextMenu:!0},Yt={onBlur:!0,onFocus:!0},Xt={onKeyDown:!0,onKeyDownCapture:!0,onKeyUp:!0,onKeyUpCapture:!0},Ht={onMouseDown:!0,onMouseEnter:!0,onMouseLeave:!0,onMouseMove:!0,onMouseOver:!0,onMouseOut:!0,onMouseUp:!0},Vt={onTouchCancel:!0,onTouchCancelCapture:!0,onTouchEnd:!0,onTouchEndCapture:!0,onTouchMove:!0,onTouchMoveCapture:!0,onTouchStart:!0,onTouchStartCapture:!0},Zt={classList:!0,style:!0};function Kt(e,t){var n={};for(var r in e)e.hasOwnProperty(r)&&(!0!==t[r]&&0!==r.indexOf("aria-")||(n[r]=e[r]));return n}const qt=E.canUseDOM?e.useLayoutEffect:e.useEffect,Ut=function(e){if(null!=e&&1===e.nodeType&&"function"==typeof e.getBoundingClientRect)return e.getBoundingClientRect()},$t=function(e,t,n){return null==t||"boolean"==typeof t||""===t?"":n||"number"!=typeof t||0===t||H.hasOwnProperty(e)&&H[e]?(""+t).trim():t+"px"},Jt=function(e,t){var n=e.style;for(var r in t)if(t.hasOwnProperty(r)){var o=0===r.indexOf("--"),i=$t(r,t[r],o);"float"===r&&(r="cssFloat"),o?n.setProperty(r,i):n[r]=i}};var Qt=function(e){var t=Ut(e),n=t.x,r=t.y,o=t.top,i=t.left;return{x:n,y:r,width:e.offsetWidth,height:e.offsetHeight,top:o,left:i}},en=function(e,t,n){var r=t||e&&e.parentNode;e&&r&&setTimeout((function(){var t=Ut(r),o=Qt(e),i=o.height,a=o.left,l=o.top,u=o.width,s=a-t.left,c=l-t.top;n(s,c,u,i,a,l)}),0)},tn={A:!0,INPUT:!0,SELECT:!0,TEXTAREA:!0},nn={blur:function(e){try{e.blur()}catch(e){}},focus:function(e){try{var t=e.nodeName;null==e.getAttribute("tabIndex")&&null==tn[t]&&e.setAttribute("tabIndex","-1"),e.focus()}catch(e){}},measure:function(e,t){en(e,null,t)},measureInWindow:function(e,t){e&&setTimeout((function(){var n=Qt(e),r=n.height,o=n.left,i=n.top,a=n.width;t(o,i,a,r)}),0)},measureLayout:function(e,t,n,r){en(e,t,r)},updateView:function(e,t){for(var n in t)if(Object.prototype.hasOwnProperty.call(t,n)){var r=t[n];switch(n){case"style":Jt(e,r);break;case"class":case"className":e.setAttribute("class",r);break;case"text":case"value":e.value=r;break;default:e.setAttribute(n,r)}}},configureNextLayoutAnimation:function(e,t){t()},setLayoutAnimationEnabledExperimental:function(){}};const rn=nn;E.canUseDOM;var on=null;function an(e,t){var n=(E.canUseDOM&&void 0!==window.ResizeObserver&&null==on&&(on=new window.ResizeObserver((function(e){e.forEach((function(e){var t=e.target,n=t.__reactLayoutHandler;"function"==typeof n&&rn.measure(t,(function(t,r,o,i,a,l){var u={nativeEvent:{layout:{x:t,y:r,width:o,height:i,left:a,top:l}},timeStamp:Date.now()};Object.defineProperty(u.nativeEvent,"target",{enumerable:!0,get:function(){return e.target}}),n(u)}))}))}))),on);qt((function(){var n=e.current;null!=n&&(n.__reactLayoutHandler=t)}),[e,t]),qt((function(){var t=e.current;return null!=t&&null!=n&&("function"==typeof t.__reactLayoutHandler?n.observe(t):n.unobserve(t)),function(){null!=t&&null!=n&&n.unobserve(t)}}),[e,n])}function ln(e){return ln="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},ln(e)}var un="function"==typeof Symbol&&"symbol"===ln(Symbol())?Symbol():Object.freeze({});function sn(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function cn(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?sn(Object(n),!0).forEach((function(t){dn(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):sn(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function dn(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var fn={};function pn(t){var n=t.classList,r=t.pointerEvents,o=t.style,i=(0,e.useRef)(null),a=(0,e.useRef)(null);a.current={classList:n,pointerEvents:r,style:o};var l=function(t){var n=e.useRef(un);return n.current===un&&(n.current=function(e){null!=e&&(e.measure=function(t){return rn.measure(e,t)},e.measureLayout=function(t,n,r){return rn.measureLayout(e,t,r,n)},e.measureInWindow=function(t){return rn.measureInWindow(e,t)},e.setNativeProps=function(t){var n=a.current||fn,r=n.classList,o=n.style,l=n.pointerEvents;!function(e,t,n,r,o,i){if(null!=e&&t){var a=Bt(null,cn(cn({pointerEvents:r},t),{},{classList:[n,t.className],style:[o,t.style]})),l=a.style;if(null!=i.current)for(var u in null==a.style&&(a.style={}),i.current)null==a.style[u]&&(a.style[u]="");i.current=l,rn.updateView(e,a)}}(e,t,r,l,o,i)})}),n.current}();return l}function vn(e){return"touchstart"===e||"mousedown"===e}function gn(e){return"touchmove"===e||"mousemove"===e}function hn(e){return"touchend"===e||"mouseup"===e||mn(e)}function mn(e){return"touchcancel"===e||"dragstart"===e}var bn=[],yn={touchBank:bn,numberActiveTouches:0,indexOfSingleActiveTouch:-1,mostRecentTimeStamp:0};function Sn(e){return e.timeStamp||e.timestamp}function Rn(e){var t=e.identifier;return null==t&&console.error("Touch object is missing identifier."),t}function wn(e){var t=Rn(e),n=bn[t];n?function(e,t){e.touchActive=!0,e.startPageX=t.pageX,e.startPageY=t.pageY,e.startTimeStamp=Sn(t),e.currentPageX=t.pageX,e.currentPageY=t.pageY,e.currentTimeStamp=Sn(t),e.previousPageX=t.pageX,e.previousPageY=t.pageY,e.previousTimeStamp=Sn(t)}(n,e):bn[t]=function(e){return{touchActive:!0,startPageX:e.pageX,startPageY:e.pageY,startTimeStamp:Sn(e),currentPageX:e.pageX,currentPageY:e.pageY,currentTimeStamp:Sn(e),previousPageX:e.pageX,previousPageY:e.pageY,previousTimeStamp:Sn(e)}}(e),yn.mostRecentTimeStamp=Sn(e)}function xn(e){var t=bn[Rn(e)];t?(t.touchActive=!0,t.previousPageX=t.currentPageX,t.previousPageY=t.currentPageY,t.previousTimeStamp=t.currentTimeStamp,t.currentPageX=e.pageX,t.currentPageY=e.pageY,t.currentTimeStamp=Sn(e),yn.mostRecentTimeStamp=Sn(e)):console.warn("Cannot record touch move without a touch start.\\n","Touch Move: "+On(e)+"\\n","Touch Bank: "+Cn())}function En(e){var t=bn[Rn(e)];t?(t.touchActive=!1,t.previousPageX=t.currentPageX,t.previousPageY=t.currentPageY,t.previousTimeStamp=t.currentTimeStamp,t.currentPageX=e.pageX,t.currentPageY=e.pageY,t.currentTimeStamp=Sn(e),yn.mostRecentTimeStamp=Sn(e)):console.warn("Cannot record touch end without a touch start.\\n","Touch End: "+On(e)+"\\n","Touch Bank: "+Cn())}function On(e){return JSON.stringify({identifier:e.identifier,pageX:e.pageX,pageY:e.pageY,timestamp:Sn(e)})}function Cn(){var e=JSON.stringify(bn.slice(0,20));return bn.length>20&&(e+=" (original size: "+bn.length+")"),e}const kn={recordTouchTrack:function(e,t){if(gn(e))t.changedTouches.forEach(xn);else if(vn(e))t.changedTouches.forEach(wn),yn.numberActiveTouches=t.touches.length,1===yn.numberActiveTouches&&(yn.indexOfSingleActiveTouch=t.touches[0].identifier);else if(hn(e)&&(t.changedTouches.forEach(En),yn.numberActiveTouches=t.touches.length,1===yn.numberActiveTouches))for(var n=0;n<bn.length;n++){var r=bn[n];if(null!=r&&r.touchActive){yn.indexOfSingleActiveTouch=n;break}}},touchHistory:yn};var Pn=function(){},Tn={},_n=[];function Dn(e){return e>20?e%20:e}function Ln(e){var t,n,r,o=!1,i=e.changedTouches,a=e.type,l=!0===e.metaKey,u=!0===e.shiftKey,s=i&&i[0].force||0,c=Dn(i&&i[0].identifier||0),d=i&&i[0].clientX||e.clientX,f=i&&i[0].clientY||e.clientY,p=i&&i[0].pageX||e.pageX,v=i&&i[0].pageY||e.pageY,g="function"==typeof e.preventDefault?e.preventDefault.bind(e):Pn,h=e.timeStamp;function m(e){return Array.prototype.slice.call(e).map((function(e){return{force:e.force,identifier:Dn(e.identifier),get locationX(){return S(e.clientX)},get locationY(){return R(e.clientY)},pageX:e.pageX,pageY:e.pageY,target:e.target,timestamp:h}}))}if(null!=i)n=m(i),r=m(e.touches);else{var b=[{force:s,identifier:c,get locationX(){return S(d)},get locationY(){return R(f)},pageX:p,pageY:v,target:e.target,timestamp:h}];n=b,r="mouseup"===a||"dragstart"===a?_n:b}var y={bubbles:!0,cancelable:!0,currentTarget:null,defaultPrevented:e.defaultPrevented,dispatchConfig:Tn,eventPhase:e.eventPhase,isDefaultPrevented:function(){return e.defaultPrevented},isPropagationStopped:function(){return o},isTrusted:e.isTrusted,nativeEvent:{altKey:!1,ctrlKey:!1,metaKey:l,shiftKey:u,changedTouches:n,force:s,identifier:c,get locationX(){return S(d)},get locationY(){return R(f)},pageX:p,pageY:v,target:e.target,timestamp:h,touches:r,type:a},persist:Pn,preventDefault:g,stopPropagation:function(){o=!0},target:e.target,timeStamp:h,touchHistory:kn.touchHistory};function S(e){if(t=t||Ut(y.currentTarget))return e-t.left}function R(e){if(t=t||Ut(y.currentTarget))return e-t.top}return y}var jn="__reactResponderId";function An(e){for(var t=[];null!=e&&e!==document.body;)t.push(e),e=e.parentNode;return t}function Mn(e){return null!=e?e[jn]:null}var In={},Nn=["onStartShouldSetResponderCapture","onStartShouldSetResponder",{bubbles:!0}],Bn=["onMoveShouldSetResponderCapture","onMoveShouldSetResponder",{bubbles:!0}],Wn={touchstart:Nn,mousedown:Nn,touchmove:Bn,mousemove:Bn,scroll:["onScrollShouldSetResponderCapture","onScrollShouldSetResponder",{bubbles:!1}]},zn={id:null,idPath:null,node:null},Fn=new Map,Gn=!1,Yn=0,Xn={id:null,node:null,idPath:null};function Hn(e){Xn=e}function Vn(e){var t=Fn.get(e);return null!=t?t:In}function Zn(e){var t=e.type,n=e.target;if("touchstart"===t&&(Gn=!0),("touchmove"===t||Yn>1)&&(Gn=!1),!("mousedown"===t&&Gn||"mousemove"===t&&Gn||"mousemove"===t&&Yn<1))if(Gn&&"mouseup"===t)0===Yn&&(Gn=!1);else{var r=vn(t)&&function(e){var t=e.altKey,n=e.button,r=e.buttons,o=e.ctrlKey,i=e.type,a=!1===t&&!1===o;return!!("touchstart"===i||"touchmove"===i||"mousedown"===i&&(0===n||1===r)&&a||"mousemove"===i&&1===r&&a)}(e),o=gn(t),i=hn(t),a=function(e){return"scroll"===e}(t),l=function(e){return"select"===e||"selectionchange"===e}(t),u=Ln(e);(r||o||i)&&(e.touches?Yn=e.touches.length:r?Yn=1:i&&(Yn=0),kn.recordTouchTrack(t,u.nativeEvent));var s,c=function(e){for(var t=[],n=[],r=function(e){return"selectionchange"===e.type?An(window.getSelection().anchorNode):null!=e.composedPath?e.composedPath():An(e.target)}(e),o=0;o<r.length;o++){var i=r[o],a=Mn(i);null!=a&&(t.push(a),n.push(i))}return{idPath:t,nodePath:n}}(e),d=!1;if(r||o||a&&Yn>0){var f=Xn.idPath,p=c.idPath;if(null!=f&&null!=p){var v=function(e,t){var n=e.length,r=t.length;if(0===n||0===r||e[n-1]!==t[r-1])return null;var o=e[0],i=0,a=t[0],l=0;n-r>0&&(o=e[i=n-r],n=r),r-n>0&&(a=t[l=r-n],r=n);for(var u=n;u--;){if(o===a)return o;o=e[i++],a=t[l++]}return null}(f,p);if(null!=v){var g=p.indexOf(v)+(v===Xn.id?1:0);c={idPath:p.slice(g),nodePath:c.nodePath.slice(g)}}else c=null}null!=c&&(s=function(e,t,n){var r=Wn[t.type];if(null!=r){for(var o=e.idPath,i=e.nodePath,a=r[0],l=r[1],u=r[2].bubbles,s=function(e,t,r){var i=Vn(e)[r];if(null!=i&&(n.currentTarget=t,!0===i(n)))return{id:e,node:t,idPath:o.slice(o.indexOf(e))}},c=o.length-1;c>=0;c--){var d=s(o[c],i[c],a);if(null!=d)return d;if(!0===n.isPropagationStopped())return}if(u)for(var f=0;f<o.length;f++){var p=s(o[f],i[f],l);if(null!=p)return p;if(!0===n.isPropagationStopped())return}else{var v=o[0],g=i[0];if(t.target===g)return s(v,g,l)}}}(c,e,u),null!=s&&(function(e,t){var n=Xn,r=n.id,o=n.node,i=t.id,a=t.node,l=Vn(i),u=l.onResponderGrant,s=l.onResponderReject;if(e.bubbles=!1,e.cancelable=!1,e.currentTarget=a,null==r)null!=u&&(e.currentTarget=a,e.dispatchConfig.registrationName="onResponderGrant",u(e)),Hn(t);else{var c=Vn(r),d=c.onResponderTerminate,f=c.onResponderTerminationRequest,p=!0;null!=f&&(e.currentTarget=o,e.dispatchConfig.registrationName="onResponderTerminationRequest",!1===f(e)&&(p=!1)),p?(null!=d&&(e.currentTarget=o,e.dispatchConfig.registrationName="onResponderTerminate",d(e)),null!=u&&(e.currentTarget=a,e.dispatchConfig.registrationName="onResponderGrant",u(e)),Hn(t)):null!=s&&(e.currentTarget=a,e.dispatchConfig.registrationName="onResponderReject",s(e))}}(u,s),d=!0))}if(null!=Xn.id&&null!=Xn.node){var h=Xn,m=h.id,b=h.node,y=Vn(m),S=y.onResponderStart,R=y.onResponderMove,w=y.onResponderEnd,x=y.onResponderRelease,E=y.onResponderTerminate,O=y.onResponderTerminationRequest;if(u.bubbles=!1,u.cancelable=!1,u.currentTarget=b,r)null!=S&&(u.dispatchConfig.registrationName="onResponderStart",S(u));else if(o)null!=R&&(u.dispatchConfig.registrationName="onResponderMove",R(u));else{var C=mn(t)||"contextmenu"===t||"blur"===t&&n===window||"blur"===t&&n.contains(b)&&e.relatedTarget!==b||a&&0===Yn||a&&n.contains(b)&&n!==b||l&&function(e){return"selectionchange"===e.type?(n=(t=window.getSelection()).toString(),r=t.anchorNode,o=t.focusNode,i=r&&r.nodeType===window.Node.TEXT_NODE||o&&o.nodeType===window.Node.TEXT_NODE,n.length>=1&&"\\n"!==n&&i):"select"===e.type;var t,n,r,o,i}(e),k=i&&!C&&!function(e,t){if(!t||0===t.length)return!1;for(var n=0;n<t.length;n++){var r=t[n].target;if(null!=r&&e.contains(r))return!0}return!1}(b,e.touches);if(i&&null!=w&&(u.dispatchConfig.registrationName="onResponderEnd",w(u)),k&&(null!=x&&(u.dispatchConfig.registrationName="onResponderRelease",x(u)),Hn(zn)),C){var P=!0;"contextmenu"!==t&&"scroll"!==t&&"selectionchange"!==t||(d?P=!1:null!=O&&(u.dispatchConfig.registrationName="onResponderTerminationRequest",!1===O(u)&&(P=!1))),P&&(null!=E&&(u.dispatchConfig.registrationName="onResponderTerminate",E(u)),Hn(zn),Gn=!1,Yn=0)}}}}}var Kn=["blur","scroll"],qn=["mousedown","mousemove","mouseup","dragstart","touchstart","touchmove","touchend","touchcancel","contextmenu","select","selectionchange"];function Un(e){Xn.id===e&&function(){var e=Xn,t=e.id,n=e.node;if(null!=t&&null!=n){var r=Vn(t).onResponderTerminate;if(null!=r){var o=Ln({});o.currentTarget=n,r(o)}Hn(zn)}Gn=!1,Yn=0}(),Fn.has(e)&&Fn.delete(e)}var $n={},Jn=0;function Qn(t,n){void 0===n&&(n=$n);var r,o,i=(r=function(){return Jn++},null==(o=e.useRef(null)).current&&(o.current=r()),o.current),a=e.useRef(!1);e.useEffect((function(){return E.canUseDOM&&null==window.__reactResponderSystemActive&&(window.addEventListener("blur",Zn),qn.forEach((function(e){document.addEventListener(e,Zn)})),Kn.forEach((function(e){document.addEventListener(e,Zn,!0)})),window.__reactResponderSystemActive=!0),function(){Un(i)}}),[i]),e.useEffect((function(){var e=n,r=e.onMoveShouldSetResponder,o=e.onMoveShouldSetResponderCapture,l=e.onScrollShouldSetResponder,u=e.onScrollShouldSetResponderCapture,s=e.onSelectionChangeShouldSetResponder,c=e.onSelectionChangeShouldSetResponderCapture,d=e.onStartShouldSetResponder,f=e.onStartShouldSetResponderCapture,p=null!=r||null!=o||null!=l||null!=u||null!=s||null!=c||null!=d||null!=f,v=t.current;p?(function(e,t,n){!function(e,t){null!=e&&(e[jn]=t)}(t,e),Fn.set(e,n)}(i,v,n),a.current=!0):a.current&&(Un(i),a.current=!1)}),[n,t,i]),e.useDebugValue({isResponder:t.current===Xn.node}),e.useDebugValue(n)}const er=(0,e.createContext)(!1);function tr(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function nr(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?tr(Object(n),!0).forEach((function(t){rr(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):tr(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function rr(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var or=nr(nr(nr(nr(nr(nr(nr(nr(nr({},zt),Ft),Gt),Yt),Xt),Ht),Vt),Zt),{},{href:!0,lang:!0,onScroll:!0,onWheel:!0,pointerEvents:!0}),ir=e.forwardRef((function(t,n){var r=t.hrefAttrs,o=t.onLayout,i=t.onMoveShouldSetResponder,l=t.onMoveShouldSetResponderCapture,u=t.onResponderEnd,s=t.onResponderGrant,c=t.onResponderMove,d=t.onResponderReject,f=t.onResponderRelease,p=t.onResponderStart,v=t.onResponderTerminate,g=t.onResponderTerminationRequest,h=t.onScrollShouldSetResponder,m=t.onScrollShouldSetResponderCapture,b=t.onSelectionChangeShouldSetResponder,y=t.onSelectionChangeShouldSetResponderCapture,S=t.onStartShouldSetResponder,R=t.onStartShouldSetResponderCapture,w=e.useContext(er),x=e.useRef(null);an(x,o),Qn(x,{onMoveShouldSetResponder:i,onMoveShouldSetResponderCapture:l,onResponderEnd:u,onResponderGrant:s,onResponderMove:c,onResponderReject:d,onResponderRelease:f,onResponderStart:p,onResponderTerminate:v,onResponderTerminationRequest:g,onScrollShouldSetResponder:h,onScrollShouldSetResponderCapture:m,onSelectionChangeShouldSetResponder:b,onSelectionChangeShouldSetResponderCapture:y,onStartShouldSetResponder:S,onStartShouldSetResponderCapture:R});var E="div",O=I.compose(w&&lr.inline,t.style),C=function(e){return Kt(e,or)}(t);if(C.classList=ar,C.style=O,null!=t.href&&(E="a",null!=r)){var k=r.download,P=r.rel,T=r.target;null!=k&&(C.download=k),null!=P&&(C.rel=P),"string"==typeof T&&(C.target="_"!==T.charAt(0)?"_"+T:T)}var _=a(x,pn(C),n);return C.ref=_,Wt(E,C)}));ir.displayName="View";var ar=[Tt({view:{alignItems:"stretch",border:"0 solid black",boxSizing:"border-box",display:"flex",flexBasis:"auto",flexDirection:"column",flexShrink:0,margin:0,minHeight:0,minWidth:0,padding:0,position:"relative",zIndex:0}}).view],lr=I.create({inline:{display:"inline-flex"}});const ur=ir;function sr(){return sr=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},sr.apply(this,arguments)}function cr(t,n){var r=t.activeOpacity,o=t.delayPressIn,i=t.delayPressOut,l=t.delayLongPress,u=t.disabled,s=t.focusable,c=t.onLongPress,d=t.onPress,f=t.onPressIn,p=t.onPressOut,v=t.rejectResponderTermination,g=t.style,h=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(t,["activeOpacity","delayPressIn","delayPressOut","delayLongPress","disabled","focusable","onLongPress","onPress","onPressIn","onPressOut","rejectResponderTermination","style"]),m=a(n,(0,e.useRef)(null)),b=(0,e.useState)("0s"),y=b[0],S=b[1],w=(0,e.useState)(null),x=w[0],E=w[1],O=(0,e.useCallback)((function(e,t){E(e),S(t?t/1e3+"s":"0s")}),[E,S]),C=(0,e.useCallback)((function(e){O(null!=r?r:.2,e)}),[r,O]),k=(0,e.useCallback)((function(e){O(null,e)}),[O]),P=function(t,n){var r=(0,e.useRef)(null);null==r.current&&(r.current=new R(n));var o=r.current;return(0,e.useEffect)((function(){o.configure(n)}),[n,o]),(0,e.useEffect)((function(){return function(){o.reset()}}),[o]),(0,e.useDebugValue)(n),o.getEventHandlers()}(0,(0,e.useMemo)((function(){return{cancelable:!v,disabled:u,delayLongPress:l,delayPressStart:o,delayPressEnd:i,onLongPress:c,onPress:d,onPressStart:function(e){var t=null!=e.dispatchConfig?"onResponderGrant"===e.dispatchConfig.registrationName:"keydown"===e.type;C(t?0:150),null!=f&&f(e)},onPressEnd:function(e){k(250),null!=p&&p(e)}}}),[l,o,i,u,c,d,f,p,v,C,k]));return e.createElement(ur,sr({},h,P,{accessibilityDisabled:u,focusable:!u&&!1!==s,ref:m,style:[dr.root,!u&&dr.actionable,g,null!=x&&{opacity:x},{transitionDuration:y}]}))}var dr=I.create({root:{transitionProperty:"opacity",transitionDuration:"0.15s",userSelect:"none"},actionable:{cursor:"pointer",touchAction:"manipulation"}}),fr=e.memo(e.forwardRef(cr));fr.displayName="TouchableOpacity";const pr=fr;function vr(e){var n,r,o,i,a,l,u,s,c,d,f,p,v,g,h,m,b,y,S,R=e.children,w=e.style,x=e.actions,E=e.editor;return t().createElement(pr,{onPress:function(e){null!=E&&E.inEditMode?(e.stopPropagation(),null==E||E.onSelect(null==E?void 0:E.id)):null==x||x.onPress()},ref:null==E?void 0:E.ref,style:{height:null==w?void 0:w.height,width:null==w?void 0:w.width,backgroundColor:null==w?void 0:w.backgroundColor,borderRadius:null==w?void 0:w.borderRadius,display:null==w?void 0:w.display,left:null==w||null===(n=w.placement)||void 0===n?void 0:n.left,right:null==w||null===(r=w.placement)||void 0===r?void 0:r.right,top:null==w||null===(o=w.placement)||void 0===o?void 0:o.top,bottom:null==w||null===(i=w.placement)||void 0===i?void 0:i.bottom,marginLeft:null==w||null===(a=w.margin)||void 0===a?void 0:a.left,marginRight:null==w||null===(l=w.margin)||void 0===l?void 0:l.right,marginTop:null==w||null===(u=w.margin)||void 0===u?void 0:u.top,marginBottom:null==w||null===(s=w.margin)||void 0===s?void 0:s.bottom,paddingLeft:null==w||null===(c=w.padding)||void 0===c?void 0:c.left,paddingRight:null==w||null===(d=w.padding)||void 0===d?void 0:d.right,paddingTop:null==w||null===(f=w.padding)||void 0===f?void 0:f.top,paddingBottom:null==w||null===(p=w.padding)||void 0===p?void 0:p.bottom,position:null==w?void 0:w.position,flexDirection:null==w||null===(v=w.flexContainer)||void 0===v?void 0:v.flexDirection,alignItems:null==w||null===(g=w.flexContainer)||void 0===g?void 0:g.alignItems,alignContent:null==w||null===(h=w.flexContainer)||void 0===h?void 0:h.alignContent,justifyContent:null==w||null===(m=w.flexContainer)||void 0===m?void 0:m.justifyContent,justifyItems:null==w||null===(b=w.flexContainer)||void 0===b?void 0:b.justifyItems,flexWrap:null==w||null===(y=w.flexContainer)||void 0===y?void 0:y.flexWrap,gap:null==w||null===(S=w.flexContainer)||void 0===S?void 0:S.gap,flex:null==w?void 0:w.flex,alignSelf:null==w?void 0:w.alignSelf}},R)}function gr(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function hr(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?gr(Object(n),!0).forEach((function(t){mr(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):gr(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function mr(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var br=hr(hr(hr(hr(hr(hr(hr(hr(hr({},zt),Ft),Gt),Yt),Xt),Ht),Vt),Zt),{},{href:!0,lang:!0,pointerEvents:!0}),yr=e.forwardRef((function(t,n){var r=t.dir,o=t.hrefAttrs,i=t.numberOfLines,l=t.onClick,u=t.onLayout,s=t.onPress,c=t.onMoveShouldSetResponder,d=t.onMoveShouldSetResponderCapture,f=t.onResponderEnd,p=t.onResponderGrant,v=t.onResponderMove,g=t.onResponderReject,h=t.onResponderRelease,m=t.onResponderStart,b=t.onResponderTerminate,y=t.onResponderTerminationRequest,S=t.onScrollShouldSetResponder,R=t.onScrollShouldSetResponderCapture,w=t.onSelectionChangeShouldSetResponder,x=t.onSelectionChangeShouldSetResponderCapture,E=t.onStartShouldSetResponder,O=t.onStartShouldSetResponderCapture,C=t.selectable,k=e.useContext(er),P=e.useRef(null),T=[Sr.text,!0===k&&Sr.textHasAncestor,1===i&&Sr.textOneLine,null!=i&&i>1&&Sr.textMultiLine],_=[t.style,null!=i&&i>1&&{WebkitLineClamp:i},!0===C&&Rr.selectable,!1===C&&Rr.notSelectable,s&&Rr.pressable];an(P,u),Qn(P,{onMoveShouldSetResponder:c,onMoveShouldSetResponderCapture:d,onResponderEnd:f,onResponderGrant:p,onResponderMove:v,onResponderReject:g,onResponderRelease:h,onResponderStart:m,onResponderTerminate:b,onResponderTerminationRequest:y,onScrollShouldSetResponder:S,onScrollShouldSetResponderCapture:R,onSelectionChangeShouldSetResponder:w,onSelectionChangeShouldSetResponderCapture:x,onStartShouldSetResponder:E,onStartShouldSetResponderCapture:O});var D=e.useCallback((function(e){null!=l?l(e):null!=s&&(e.stopPropagation(),s(e))}),[l,s]),L=k?"span":"div",j=function(e){return Kt(e,br)}(t);if(j.classList=T,j.dir=r,k||(j.dir=null!=r?r:"auto"),(l||s)&&(j.onClick=D),j.style=_,null!=t.href&&(L="a",null!=o)){var A=o.download,M=o.rel,I=o.target;null!=A&&(j.download=A),null!=M&&(j.rel=M),"string"==typeof I&&(j.target="_"!==I.charAt(0)?"_"+I:I)}var N=a(P,pn(j),n);j.ref=N;var B=Wt(L,j);return k?B:e.createElement(er.Provider,{value:!0},B)}));yr.displayName="Text";var Sr=Tt({text:{border:"0 solid black",boxSizing:"border-box",color:"black",display:"inline",font:"14px System",margin:0,padding:0,whiteSpace:"pre-wrap",wordWrap:"break-word"},textHasAncestor:{color:"inherit",font:"inherit",whiteSpace:"inherit"},textOneLine:{maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",wordWrap:"normal"},textMultiLine:{display:"-webkit-box",maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",WebkitBoxOrient:"vertical"}}),Rr=I.create({notSelectable:{userSelect:"none"},selectable:{userSelect:"text"},pressable:{cursor:"pointer"}});const wr=yr;function xr(e){var n,r,o,i,a,l=e.properties,u=e.style,s=(e.actions,e.editor);return t().createElement(wr,{style:{height:null==u?void 0:u.height,width:null==u?void 0:u.width,color:null==u?void 0:u.color,fontSize:null==u||null===(n=u.font)||void 0===n?void 0:n.size,fontStyle:null==u||null===(r=u.font)||void 0===r?void 0:r.style,fontWeight:null==u||null===(o=u.font)||void 0===o?void 0:o.weight,textAlign:null==u||null===(i=u.font)||void 0===i?void 0:i.textAlign,textTransform:null==u||null===(a=u.font)||void 0===a?void 0:a.textTransform},onPress:null!=s&&s.inEditMode?function(e){null!=s&&s.inEditMode&&(e.stopPropagation(),null==s||s.onSelect(null==s?void 0:s.id))}:void 0,ref:null==s?void 0:s.ref},null==l?void 0:l.text)}const Er={_currentlyFocusedNode:null,currentlyFocusedField:function(){return document.activeElement!==this._currentlyFocusedNode&&(this._currentlyFocusedNode=null),this._currentlyFocusedNode},focusTextInput:function(e){null!==e&&(this._currentlyFocusedNode=e,document.activeElement!==e&&rn.focus(e))},blurTextInput:function(e){null!==e&&(this._currentlyFocusedNode=null,document.activeElement===e&&rn.blur(e))}};function Or(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Cr(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Or(Object(n),!0).forEach((function(t){kr(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Or(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function kr(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var Pr=Cr(Cr(Cr(Cr(Cr(Cr(Cr(Cr(Cr({},zt),Ft),Gt),Yt),Xt),Ht),Vt),Zt),{},{autoCapitalize:!0,autoComplete:!0,autoCorrect:!0,autoFocus:!0,defaultValue:!0,disabled:!0,lang:!0,maxLength:!0,onChange:!0,onScroll:!0,placeholder:!0,pointerEvents:!0,readOnly:!0,rows:!0,spellCheck:!0,value:!0,type:!0}),Tr=null,_r=e.forwardRef((function(t,n){var r,o,i=t.autoCapitalize,l=void 0===i?"sentences":i,u=t.autoComplete,s=t.autoCompleteType,c=t.autoCorrect,d=void 0===c||c,f=t.blurOnSubmit,p=t.clearTextOnFocus,v=t.dir,g=t.editable,h=void 0===g||g,m=t.keyboardType,b=void 0===m?"default":m,y=t.multiline,S=void 0!==y&&y,R=t.numberOfLines,w=void 0===R?1:R,x=t.onBlur,E=t.onChange,O=t.onChangeText,C=t.onContentSizeChange,k=t.onFocus,P=t.onKeyPress,T=t.onLayout,_=t.onMoveShouldSetResponder,D=t.onMoveShouldSetResponderCapture,L=t.onResponderEnd,j=t.onResponderGrant,A=t.onResponderMove,M=t.onResponderReject,N=t.onResponderRelease,B=t.onResponderStart,W=t.onResponderTerminate,z=t.onResponderTerminationRequest,F=t.onScrollShouldSetResponder,G=t.onScrollShouldSetResponderCapture,Y=t.onSelectionChange,X=t.onSelectionChangeShouldSetResponder,H=t.onSelectionChangeShouldSetResponderCapture,V=t.onStartShouldSetResponder,Z=t.onStartShouldSetResponderCapture,K=t.onSubmitEditing,q=t.placeholderTextColor,U=t.returnKeyType,$=t.secureTextEntry,J=void 0!==$&&$,Q=t.selection,ee=t.selectTextOnFocus,te=t.spellCheck;switch(b){case"email-address":r="email";break;case"number-pad":case"numeric":o="numeric";break;case"decimal-pad":o="decimal";break;case"phone-pad":r="tel";break;case"search":case"web-search":r="search";break;case"url":r="url";break;default:r="text"}J&&(r="password");var ne=e.useRef({height:null,width:null}),re=e.useRef(null),oe=e.useCallback((function(e){if(S&&C&&null!=e){var t=e.scrollHeight,n=e.scrollWidth;t===ne.current.height&&n===ne.current.width||(ne.current.height=t,ne.current.width=n,C({nativeEvent:{contentSize:{height:ne.current.height,width:ne.current.width}}}))}}),[S,C]),ie=e.useMemo((function(){return function(e){null!=e&&(e.clear=function(){null!=e&&(e.value="")},e.isFocused=function(){return null!=e&&Er.currentlyFocusedField()===e},oe(e))}}),[oe]);qt((function(){var e=re.current;null!=e&&null!=Q&&function(e,t){if(function(e,t){var n=e.selectionEnd,r=e.selectionStart,o=t.start,i=t.end;return o!==r||i!==n}(e,t)){var n=t.start,r=t.end;try{e.setSelectionRange(n,r||n)}catch(e){}}}(e,Q),document.activeElement===e&&(Er._currentlyFocusedNode=e)}),[re,Q]);var ae=S?"textarea":"input",le=[Dr.textinput],ue=I.compose(t.style,q&&{placeholderTextColor:q});an(re,T),Qn(re,{onMoveShouldSetResponder:_,onMoveShouldSetResponderCapture:D,onResponderEnd:L,onResponderGrant:j,onResponderMove:A,onResponderReject:M,onResponderRelease:N,onResponderStart:B,onResponderTerminate:W,onResponderTerminationRequest:z,onScrollShouldSetResponder:F,onScrollShouldSetResponderCapture:G,onSelectionChangeShouldSetResponder:X,onSelectionChangeShouldSetResponderCapture:H,onStartShouldSetResponder:V,onStartShouldSetResponderCapture:Z});var se=function(e){return Kt(e,Pr)}(t);se.autoCapitalize=l,se.autoComplete=u||s||"on",se.autoCorrect=d?"on":"off",se.classList=le,se.dir=void 0!==v?v:"auto",se.enterKeyHint=U,se.onBlur=function(e){Er._currentlyFocusedNode=null,x&&(e.nativeEvent.text=e.target.value,x(e))},se.onChange=function(e){var t=e.target,n=t.value;e.nativeEvent.text=n,oe(t),E&&E(e),O&&O(n)},se.onFocus=function(e){var t=e.target;k&&(e.nativeEvent.text=t.value,k(e)),null!=t&&(Er._currentlyFocusedNode=t,p&&(t.value=""),ee&&(null!=Tr&&clearTimeout(Tr),Tr=setTimeout((function(){null!=t&&t.select()}),0)))},se.onKeyDown=function(e){var t=e.target;e.stopPropagation();var n=null==f?!S:f,r=e.nativeEvent,o=function(e){return e.isComposing||229===e.keyCode}(r);P&&P(e),"Enter"!==e.key||e.shiftKey||o||e.isDefaultPrevented()||(!f&&S||!K||(e.preventDefault(),r.text=e.target.value,K(e)),n&&null!=t&&t.blur())},se.onSelect=function(e){if(Y)try{var t=e.target,n=t.selectionStart,r=t.selectionEnd;e.nativeEvent.selection={start:n,end:r},e.nativeEvent.text=e.target.value,Y(e)}catch(e){}},se.readOnly=!h,se.rows=S?w:void 0,se.spellCheck=null!=te?te:d,se.style=ue,se.type=S?void 0:r,se.inputMode=o;var ce=pn(se),de=a(re,ce,ie,n);return se.ref=de,Wt(ae,se)}));_r.displayName="TextInput",_r.State=Er;var Dr=Tt({textinput:{MozAppearance:"textfield",WebkitAppearance:"none",backgroundColor:"transparent",border:"0 solid black",borderRadius:0,boxSizing:"border-box",font:"14px System",margin:0,padding:0,resize:"none"}});const Lr=_r;function jr(e){var n,r=e.properties,o=e.style,i=e.actions,a=e.editor;return t().createElement(Lr,{style:o,placeholder:r.placeholder,value:null===(n=r.text)||void 0===n?void 0:n.value,onChangeText:function(e){var t;return null===(t=r.text)||void 0===t?void 0:t.onChange(e)},onFocus:function(e){null!=a&&a.inEditMode?(e.stopPropagation(),null==a||a.onSelect(null==a?void 0:a.id)):null==i||i.onFocus()},ref:null==a?void 0:a.ref})}function Ar(e){var n,r,o,i,a,l,u,s,c,d,f,p=e.children,v=(e.properties,e.layout,e.style),g=(e.actions,e.editor);return t().createElement(ur,{onClick:function(e){null!=g&&g.inEditMode&&(e.stopPropagation(),null==g||g.onSelect(null==g?void 0:g.id))},ref:null==g?void 0:g.ref,style:{height:null==v?void 0:v.height,width:null==v?void 0:v.width,backgroundColor:null==v?void 0:v.backgroundColor,borderRadius:null==v?void 0:v.borderRadius,display:null==v?void 0:v.display,paddingLeft:null==v||null===(n=v.padding)||void 0===n?void 0:n.left,paddingRight:null==v||null===(r=v.padding)||void 0===r?void 0:r.right,paddingTop:null==v||null===(o=v.padding)||void 0===o?void 0:o.top,paddingBottom:null==v||null===(i=v.padding)||void 0===i?void 0:i.bottom,flexDirection:null==v||null===(a=v.flexContainer)||void 0===a?void 0:a.flexDirection,alignItems:null==v||null===(l=v.flexContainer)||void 0===l?void 0:l.alignItems,alignContent:null==v||null===(u=v.flexContainer)||void 0===u?void 0:u.alignContent,justifyContent:null==v||null===(s=v.flexContainer)||void 0===s?void 0:s.justifyContent,justifyItems:null==v||null===(c=v.flexContainer)||void 0===c?void 0:c.justifyItems,flexWrap:null==v||null===(d=v.flexContainer)||void 0===d?void 0:d.flexWrap,gap:null==v||null===(f=v.flexContainer)||void 0===f?void 0:f.gap,flex:null==v?void 0:v.flex}},p)}var Mr=[];function Ir(e){return Mr[e-1]}var Nr=/^data:/,Br=function(){function e(){}return e.has=function(t){var n=e._entries;return Nr.test(t)||Boolean(n[t])},e.add=function(t){var n=e._entries,r=Date.now();n[t]?(n[t].lastUsedTimestamp=r,n[t].refCount+=1):n[t]={lastUsedTimestamp:r,refCount:1}},e.remove=function(t){var n=e._entries;n[t]&&(n[t].refCount-=1),e._cleanUpIfNeeded()},e._cleanUpIfNeeded=function(){var t,n,r=e._entries,o=Object.keys(r);o.length+1>e._maximumEntries&&(o.forEach((function(e){var o=r[e];(!n||o.lastUsedTimestamp<n.lastUsedTimestamp)&&0===o.refCount&&(t=e,n=o)})),t&&delete r[t])},e}();Br._maximumEntries=256,Br._entries={};var Wr=0,zr={},Fr={abort:function(e){var t=zr[""+e];t&&(t.onerror=null,t.onload=null,t=null,delete zr[""+e])},getSize:function(e,t,n){var r=!1,o=setInterval(a,16),i=Fr.load(e,a,(function(){"function"==typeof n&&n(),Fr.abort(i),clearInterval(o)}));function a(){var e=zr[""+i];if(e){var n=e.naturalHeight,a=e.naturalWidth;n&&a&&(t(a,n),r=!0)}r&&(Fr.abort(i),clearInterval(o))}},has:function(e){return Br.has(e)},load:function(e,t,n){Wr+=1;var r=new window.Image;return r.onerror=n,r.onload=function(e){var n=function(){return t({nativeEvent:e})};"function"==typeof r.decode?r.decode().then(n,n):setTimeout(n,0)},r.src=e,zr[""+Wr]=r,Wr},prefetch:function(e){return new Promise((function(t,n){Fr.load(e,(function(){Br.add(e),Br.remove(e),t()}),n)}))},queryCache:function(e){var t={};return e.forEach((function(e){Br.has(e)&&(t[e]="disk/memory")})),Promise.resolve(t)}};const Gr=Fr;var Yr={window:{fontScale:1,height:0,scale:1,width:0},screen:{fontScale:1,height:0,scale:1,width:0}},Xr={},Hr=function(){function e(){}return e.get=function(e){return D()(Yr[e],"No dimension set for key "+e),Yr[e]},e.set=function(e){e&&(E.canUseDOM?D()(!1,"Dimensions cannot be set in the browser"):(null!=e.screen&&(Yr.screen=e.screen),null!=e.window&&(Yr.window=e.window)))},e._update=function(){if(E.canUseDOM){var e=window,t=e.document.documentElement;Yr.window={fontScale:1,height:t.clientHeight,scale:e.devicePixelRatio||1,width:t.clientWidth},Yr.screen={fontScale:1,height:e.screen.height,scale:e.devicePixelRatio||1,width:e.screen.width},Array.isArray(Xr.change)&&Xr.change.forEach((function(e){return e(Yr)}))}},e.addEventListener=function(e,t){var n=this;return Xr[e]=Xr[e]||[],Xr[e].push(t),{remove:function(){n.removeEventListener(e,t)}}},e.removeEventListener=function(e,t){Array.isArray(Xr[e])&&(Xr[e]=Xr[e].filter((function(e){return e!==t})))},e}();E.canUseDOM&&(Hr._update(),window.addEventListener("resize",Hr._update,!1));var Vr=function(){function e(){}return e.get=function(){return Hr.get("window").scale},e.getFontScale=function(){return Hr.get("window").fontScale||e.get()},e.getPixelSizeForLayoutSize=function(t){return Math.round(t*e.get())},e.roundToNearestPixel=function(t){var n=e.get();return Math.round(t*n)/n},e}();function Zr(e){return Zr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Zr(e)}function Kr(){return Kr=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Kr.apply(this,arguments)}function qr(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Ur(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?qr(Object(n),!0).forEach((function(t){$r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):qr(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function $r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var Jr="LOADED",Qr="LOADING",eo=0,to=/^(data:image\\/svg\\+xml;utf8,)(.*)/;function no(e){var t=null;if("number"==typeof e){var n=Ir(e),r=n.scales[0];if(n.scales.length>1){var o=Vr.get();r=n.scales.reduce((function(e,t){return Math.abs(t-o)<Math.abs(e-o)?t:e}))}var i=1!==r?"@"+r+"x":"";t=n?n.httpServerLocation+"/"+n.name+i+"."+n.type:""}else"string"==typeof e?t=e:e&&"string"==typeof e.uri&&(t=e.uri);if(t){var a=t.match(to);if(a){var l=a[1],u=a[2];return""+l+encodeURIComponent(u)}}return t}var ro=e.forwardRef((function(t,n){var r=t.accessibilityLabel,o=t.blurRadius,i=t.defaultSource,a=t.draggable,l=t.onError,u=t.onLayout,s=t.onLoad,c=t.onLoadEnd,d=t.onLoadStart,f=t.pointerEvents,p=t.source,v=t.style,g=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(t,["accessibilityLabel","blurRadius","defaultSource","draggable","onError","onLayout","onLoad","onLoadEnd","onLoadStart","pointerEvents","source","style"]),h=e.useState((function(){var e=no(p);return null!=e&&Gr.has(e)?Jr:"IDLE"})),m=h[0],b=h[1],y=e.useState({}),S=y[0],R=y[1],w=e.useContext(er),x=e.useRef(null),E=e.useRef(eo++),O=e.useRef(null),C=m===Jr||m===Qr&&null==i,k=function(e,t,n){var r=Ur({},I.flatten(e)),o=r.filter,i=r.resizeMode,a=r.shadowOffset,l=r.tintColor,u=[],s=null;if(o&&u.push(o),t&&u.push("blur("+t+"px)"),a){var c=J(r);c&&u.push("drop-shadow("+c+")")}return l&&null!=n&&u.push("url(#tint-"+n+")"),u.length>0&&(s=u.join(" ")),delete r.blurRadius,delete r.shadowColor,delete r.shadowOpacity,delete r.shadowOffset,delete r.shadowRadius,delete r.tintColor,delete r.overlayColor,delete r.resizeMode,[r,i,s,l]}(v,o,E.current),P=k[0],T=k[1],_=k[2],D=k[3],L=t.resizeMode||T||"cover",j=C?p:i,A=no(j),M=function(e){if("number"==typeof e){var t=Ir(e);return{height:t.height,width:t.width}}if(null!=e&&!Array.isArray(e)&&"object"===Zr(e))return{height:e.height,width:e.width}}(j),N=A?\'url("\'+A+\'")\':null,B=function(){if(null!=x.current&&("center"===L||"repeat"===L)){var e=x.current,t=e.naturalHeight,n=e.naturalWidth,r=S.height,o=S.width;if(t&&n&&r&&o){var i=Math.min(1,o/n,r/t);return Math.ceil(i*n)+"px "+Math.ceil(i*t)+"px"}}}(),W=A?Wt("img",{alt:r||"",classList:[io.accessibilityImage],draggable:a||!1,ref:x,src:A}):null,z=no(p);return e.useEffect((function(){function e(){null!=O.current&&(Gr.abort(O.current),O.current=null)}return e(),null!=z&&(b(Qr),d&&d(),O.current=Gr.load(z,(function(e){b(Jr),s&&s(e),c&&c()}),(function(){b("ERRORED"),l&&l({nativeEvent:{error:"Failed to load resource "+z+" (404)"}}),c&&c()}))),e}),[z,O,b,l,s,c,d]),e.createElement(ur,Kr({},g,{accessibilityLabel:r,onLayout:function(e){if("center"===L||"repeat"===L||u){var t=e.nativeEvent.layout;u&&u(e),R(t)}},pointerEvents:f,ref:n,style:[ao.root,w&&ao.inline,M,P]}),e.createElement(ur,{style:[ao.image,lo[L],{backgroundImage:N,filter:_},null!=B&&{backgroundSize:B}],suppressHydrationWarning:!0}),W,function(t,n){return t&&null!=n?e.createElement("svg",{style:{position:"absolute",height:0,visibility:"hidden",width:0}},e.createElement("defs",null,e.createElement("filter",{id:"tint-"+n,suppressHydrationWarning:!0},e.createElement("feFlood",{floodColor:""+t,key:t}),e.createElement("feComposite",{in2:"SourceAlpha",operator:"atop"})))):null}(D,E.current))}));ro.displayName="Image";var oo=ro;oo.getSize=function(e,t,n){Gr.getSize(e,t,n)},oo.prefetch=function(e){return Gr.prefetch(e)},oo.queryCache=function(e){return Gr.queryCache(e)};var io=Tt({accessibilityImage:Ur(Ur({},I.absoluteFillObject),{},{height:"100%",opacity:0,width:"100%",zIndex:-1})}),ao=I.create({root:{flexBasis:"auto",overflow:"hidden",zIndex:0},inline:{display:"inline-flex"},image:Ur(Ur({},I.absoluteFillObject),{},{backgroundColor:"transparent",backgroundPosition:"center",backgroundRepeat:"no-repeat",backgroundSize:"cover",height:"100%",width:"100%",zIndex:-1})}),lo=I.create({center:{backgroundSize:"auto"},contain:{backgroundSize:"contain"},cover:{backgroundSize:"cover"},none:{backgroundPosition:"0 0",backgroundSize:"auto"},repeat:{backgroundPosition:"0 0",backgroundRepeat:"repeat",backgroundSize:"auto"},stretch:{backgroundSize:"100% 100%"}});const uo=oo;function so(){return so=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},so.apply(this,arguments)}var co={},fo=(0,e.forwardRef)((function(t,n){var r=t.children,o=t.style,i=void 0===o?co:o,a=t.imageStyle,l=t.imageRef,u=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(t,["children","style","imageStyle","imageRef"]),s=I.flatten(i),c=s.height,d=s.width;return e.createElement(ur,{ref:n,style:i},e.createElement(uo,so({},u,{ref:l,style:[I.absoluteFill,{width:d,height:c,zIndex:-1},a]})),r)}));fo.displayName="ImageBackground";const po=fo;function vo(e){var n,r,o,i,a,l,u,s,c,d,f,p,v,g,h,m,b,y,S,R=e.style,w=e.children,x=e.editor;return t().createElement(ur,{onClick:function(e){null!=x&&x.inEditMode&&(e.stopPropagation(),null==x||x.onSelect(null==x?void 0:x.id))},ref:null==x?void 0:x.ref,style:{height:null==R?void 0:R.height,width:null==R?void 0:R.width,backgroundColor:null==R?void 0:R.backgroundColor,borderRadius:null==R?void 0:R.borderRadius,display:null==R?void 0:R.display,marginLeft:null==R||null===(n=R.margin)||void 0===n?void 0:n.left,marginRight:null==R||null===(r=R.margin)||void 0===r?void 0:r.right,marginTop:null==R||null===(o=R.margin)||void 0===o?void 0:o.top,marginBottom:null==R||null===(i=R.margin)||void 0===i?void 0:i.bottom,paddingLeft:null==R||null===(a=R.padding)||void 0===a?void 0:a.left,paddingRight:null==R||null===(l=R.padding)||void 0===l?void 0:l.right,paddingTop:null==R||null===(u=R.padding)||void 0===u?void 0:u.top,paddingBottom:null==R||null===(s=R.padding)||void 0===s?void 0:s.bottom,position:null==R?void 0:R.position,flexDirection:null==R||null===(c=R.flexContainer)||void 0===c?void 0:c.flexDirection,alignItems:null==R||null===(d=R.flexContainer)||void 0===d?void 0:d.alignItems,alignContent:null==R||null===(f=R.flexContainer)||void 0===f?void 0:f.alignContent,justifyContent:null==R||null===(p=R.flexContainer)||void 0===p?void 0:p.justifyContent,justifyItems:null==R||null===(v=R.flexContainer)||void 0===v?void 0:v.justifyItems,flexWrap:null==R||null===(g=R.flexContainer)||void 0===g?void 0:g.flexWrap,gap:null==R||null===(h=R.flexContainer)||void 0===h?void 0:h.gap,flex:null==R?void 0:R.flex}},null!=R&&null!==(m=R.backgroundImage)&&void 0!==m&&m.source?t().createElement(po,{source:null==R||null===(b=R.backgroundImage)||void 0===b?void 0:b.source,resizeMode:null==R||null===(y=R.backgroundImage)||void 0===y?void 0:y.resizeMode,style:null==R||null===(S=R.backgroundImage)||void 0===S?void 0:S.style},w):t().createElement(t().Fragment,null,w))}function go(e){var n,r,o,i,a,l,u,s,c,d,f,p,v,g,h,m=e.style,b=e.children,y=e.editor;return t().createElement(ur,{onClick:function(e){null!=y&&y.inEditMode&&(e.stopPropagation(),null==y||y.onSelect(null==y?void 0:y.id))},ref:null==y?void 0:y.ref,style:{height:null==m?void 0:m.height,width:null==m?void 0:m.width,backgroundColor:null==m?void 0:m.backgroundColor,borderRadius:null==m?void 0:m.borderRadius,display:null==m?void 0:m.display,marginLeft:null==m||null===(n=m.margin)||void 0===n?void 0:n.left,marginRight:null==m||null===(r=m.margin)||void 0===r?void 0:r.right,marginTop:null==m||null===(o=m.margin)||void 0===o?void 0:o.top,marginBottom:null==m||null===(i=m.margin)||void 0===i?void 0:i.bottom,paddingLeft:null==m||null===(a=m.padding)||void 0===a?void 0:a.left,paddingRight:null==m||null===(l=m.padding)||void 0===l?void 0:l.right,paddingTop:null==m||null===(u=m.padding)||void 0===u?void 0:u.top,paddingBottom:null==m||null===(s=m.padding)||void 0===s?void 0:s.bottom,position:null==m?void 0:m.position,flexDirection:null==m||null===(c=m.flexContainer)||void 0===c?void 0:c.flexDirection,alignItems:null==m||null===(d=m.flexContainer)||void 0===d?void 0:d.alignItems,alignContent:null==m||null===(f=m.flexContainer)||void 0===f?void 0:f.alignContent,justifyContent:null==m||null===(p=m.flexContainer)||void 0===p?void 0:p.justifyContent,justifyItems:null==m||null===(v=m.flexContainer)||void 0===v?void 0:v.justifyItems,flexWrap:null==m||null===(g=m.flexContainer)||void 0===g?void 0:g.flexWrap,gap:null==m||null===(h=m.flexContainer)||void 0===h?void 0:h.gap,flex:null==m?void 0:m.flex}},b)}function ho(){return ho=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},ho.apply(this,arguments)}function mo(e){return t().createElement("input",ho({type:"checkbox"},e,{checked:e.value,onChange:function(t){e.onValueChange&&(e.checked.onChange(t.currentTarget.checked),e.onValueChange(t.currentTarget.checked))}}))}function bo(e){var n=e.children,r=e.editor;return t().createElement(ur,{onClick:function(e){null!=r&&r.inEditMode&&(e.stopPropagation(),null==r||r.onSelect(null==r?void 0:r.id))},ref:null==r?void 0:r.ref,style:{flexDirection:"row",gap:"0.5em",margin:"30px",flexWrap:"wrap",height:"auto",minHeight:"350px"}},n)}function yo(e){var n=e.properties,r=e.style;return t().createElement(uo,{style:r,source:{uri:n.source}})}function So(e){var n,r,o,i,a,l,u,s,c,d,f,p,v,g,h,m,b,y=e.style,S=e.layout,R=e.children;return t().createElement(po,{source:null==y||null===(n=y.backgroundImage)||void 0===n?void 0:n.source,resizeMode:null==y||null===(r=y.backgroundImage)||void 0===r?void 0:r.resizeMode,style:{height:null==y?void 0:y.height,width:null==y?void 0:y.width,backgroundColor:null==y?void 0:y.backgroundColor,borderRadius:null==y?void 0:y.borderRadius,display:null==y?void 0:y.display,marginLeft:null==S||null===(o=S.margin)||void 0===o?void 0:o.left,marginRight:null==S||null===(i=S.margin)||void 0===i?void 0:i.right,marginTop:null==S||null===(a=S.margin)||void 0===a?void 0:a.top,marginBottom:null==S||null===(l=S.margin)||void 0===l?void 0:l.bottom,paddingLeft:null==S||null===(u=S.padding)||void 0===u?void 0:u.left,paddingRight:null==S||null===(s=S.padding)||void 0===s?void 0:s.right,paddingTop:null==S||null===(c=S.padding)||void 0===c?void 0:c.top,paddingBottom:null==S||null===(d=S.padding)||void 0===d?void 0:d.bottom,position:null==S?void 0:S.position,flexDirection:null==S||null===(f=S.flexContainer)||void 0===f?void 0:f.flexDirection,alignItems:null==S||null===(p=S.flexContainer)||void 0===p?void 0:p.alignItems,alignContent:null==S||null===(v=S.flexContainer)||void 0===v?void 0:v.alignContent,justifyContent:null==S||null===(g=S.flexContainer)||void 0===g?void 0:g.justifyContent,justifyItems:null==S||null===(h=S.flexContainer)||void 0===h?void 0:h.justifyItems,flexWrap:null==S||null===(m=S.flexContainer)||void 0===m?void 0:m.flexWrap,gap:null==S||null===(b=S.flexContainer)||void 0===b?void 0:b.gap,flex:null==S?void 0:S.flex}},R)}})(),window["@fuchsia-for-all/primitives"]=r})();',
    components: [
      {
        name: "Button",
        componentType: "Container",
        schema: {
          type: "ui-component",
          title: "Button",
          icon: "SmartButton",
          componentType: "Container",
          description: "A plain old text field",
          width: 160,
          height: 35,
          properties: {
            properties: {
              type: "object",
              title: "Properties",
              properties: {
                title: {
                  type: "string",
                  title: "Display value",
                  description: "The value to display",
                  default: "Lorem Ipsum",
                },
              },
            },
            style: {
              type: "object",
              title: "Component Styling",
              description: "The style for the component",
              properties: {
                height: { title: "Height", type: "number", default: 35 },
                width: { title: "Width", type: "number", default: 175 },
                backgroundColor: {
                  title: "Background Color",
                  type: "string",
                  format: "color",
                  default: "#000000",
                },
                borderRadius: {
                  title: "Border Radius",
                  type: "number",
                  default: 5,
                },
                display: { title: "Display", type: "string", default: "flex" },
                position: {
                  title: "Position",
                  type: "string",
                  default: "initial",
                },
                placement: {
                  title: "Position",
                  type: "position",
                  default: "initial",
                },
                flexContainer: { title: "Flex", type: "flexContainer" },
                margin: { title: "Margin", type: "margin" },
                padding: { title: "Padding", type: "padding" },
                flex: { title: "Flex", type: "string" },
                alignSelf: { title: "Align Self", type: "string" },
              },
            },
            actions: {
              type: "object",
              title: "Actions",
              properties: {
                onPress: {
                  title: "onPress",
                  type: "function",
                  arguments: [],
                  returnType: "null",
                },
              },
            },
          },
        },
        defaultPropValue: {
          properties: { title: "Lorem Ipsum" },
          style: {
            height: 35,
            width: 175,
            backgroundColor: "#000000",
            borderRadius: 5,
            display: "flex",
            position: "initial",
            placement: "initial",
          },
        },
        icon: "SmartButton",
        _id: "628695e9891321c8b9743593",
      },
      {
        name: "Checkbox",
        componentType: "Element",
        schema: {
          type: "ui-component",
          title: "Checkbox",
          icon: "CheckBox",
          componentType: "Element",
          description: "A plain old checkbox",
          width: 15,
          height: 15,
          properties: {
            properties: {
              type: "object",
              title: "Properties",
              properties: {
                disabled: {
                  title: "Disabled",
                  type: "boolean",
                  default: false,
                },
                value: {
                  title: "Value",
                  type: "boolean",
                  default: true,
                  dataBound: true,
                },
              },
            },
            style: {
              type: "object",
              title: "Component Styling",
              description: "The style for the component",
              properties: {
                height: { title: "Height", type: "number", default: 15 },
                width: { title: "Width", type: "number", default: 15 },
                color: {
                  title: "Text Color",
                  type: "string",
                  format: "color",
                  default: "#000000",
                },
              },
            },
          },
        },
        defaultPropValue: {
          properties: { value: true },
          style: { height: 15, width: 15, color: "#000000" },
        },
        icon: "CheckBox",
        _id: "628695e9891321c8b9743594",
      },
      {
        name: "Container",
        componentType: "Container",
        schema: {
          type: "layout-component",
          title: "Container",
          icon: "AutoAwesomeMosaic",
          componentType: "Container",
          description: "A plain old text field",
          width: 160,
          height: 35,
          properties: {
            style: {
              type: "object",
              title: "Component Styling",
              description: "The style for the component",
              properties: {
                height: { title: "Height", type: "number", default: 150 },
                width: { title: "Width", type: "number", default: 150 },
                borderRadius: {
                  title: "Border Radius",
                  type: "number",
                  default: 5,
                },
                backgroundColor: {
                  title: "Background Color",
                  type: "string",
                  default: "#303030",
                  format: "color",
                },
                display: { title: "Display", type: "string", default: "flex" },
                position: {
                  title: "Position",
                  type: "string",
                  default: "initial",
                },
                flexContainer: { title: "Flex", type: "flexContainer" },
                margin: { title: "Margin", type: "margin" },
                padding: { title: "Padding", type: "padding" },
                flex: { title: "Flex", type: "string", default: "1" },
              },
            },
          },
        },
        defaultPropValue: {
          style: {
            height: 150,
            width: 150,
            borderRadius: 5,
            backgroundColor: "#303030",
            display: "flex",
            position: "initial",
            flex: "1",
          },
        },
        icon: "AutoAwesomeMosaic",
        _id: "628695e9891321c8b9743595",
      },
      {
        name: "Image",
        componentType: "Element",
        schema: {
          type: "ui-component",
          title: "Image",
          icon: "Image",
          componentType: "Element",
          description: "A plain old text field",
          width: 160,
          height: 35,
          properties: {
            properties: {
              type: "object",
              title: "Properties",
              properties: {
                source: {
                  type: "string",
                  title: "Image URL",
                  description: "The value to display",
                  default: "Lorem Ipsum",
                },
              },
            },
            style: {
              type: "object",
              title: "Component Styling",
              description: "The style for the component",
              properties: {
                height: { title: "Height", type: "string", default: "35px" },
                width: { title: "Width", type: "string", default: "175px" },
              },
            },
            actions: {
              type: "object",
              title: "Actions",
              properties: {
                onPress: {
                  title: "onPress",
                  type: "function",
                  arguments: [],
                  returnType: "null",
                },
              },
            },
          },
        },
        defaultPropValue: {
          properties: { source: "Lorem Ipsum" },
          style: { height: "35px", width: "175px" },
        },
        icon: "Image",
        _id: "628695e9891321c8b9743596",
      },
      {
        name: "ImageBackground",
        componentType: "Container",
        schema: {
          type: "layout-component",
          title: "ImageBackground",
          icon: "Wallpaper",
          componentType: "Container",
          description: "A plain old text field",
          width: 160,
          height: 35,
          properties: {
            style: {
              type: "object",
              title: "Component Styling",
              description: "The style for the component",
              properties: {
                height: { title: "Height", type: "number", default: 150 },
                width: { title: "Width", type: "number", default: 150 },
                borderRadius: {
                  title: "Border Radius",
                  type: "number",
                  default: 5,
                },
                backgroundColor: {
                  title: "Background Color",
                  type: "string",
                  default: "#303030",
                  format: "color",
                },
                backgroundImage: {
                  type: "object",
                  title: "Background Image",
                  properties: {
                    source: { title: "Image URL", type: "string" },
                    resizeMode: { title: "Resize Mode", type: "string" },
                    style: {
                      type: "object",
                      title: "Style",
                      properties: {
                        justifyContent: {
                          title: "Justify Content",
                          type: "string",
                        },
                        flex: { title: "Flex", type: "number" },
                      },
                    },
                  },
                },
              },
            },
            layout: {
              type: "object",
              title: "Component Layout",
              properties: {
                display: { title: "Display", type: "string", default: "flex" },
                position: {
                  title: "Position",
                  type: "string",
                  default: "initial",
                },
                flexContainer: { title: "Flex", type: "flexContainer" },
                margin: { title: "Margin", type: "margin" },
                padding: { title: "Padding", type: "padding" },
                flex: { title: "Flex", type: "string", default: "1" },
              },
            },
          },
        },
        defaultPropValue: {
          style: {
            height: 150,
            width: 150,
            borderRadius: 5,
            backgroundColor: "#303030",
          },
          layout: { display: "flex", position: "initial", flex: "1" },
        },
        icon: "Wallpaper",
        _id: "628695e9891321c8b9743597",
      },
      {
        name: "List",
        componentType: "Container",
        schema: {
          type: "array",
          title: "List",
          description: "Simple List",
          componentType: "Container",
          icon: "List",
          width: 350,
          height: 300,
          properties: {
            style: {
              type: "object",
              title: "Component Styling",
              description: "The style for the component",
              properties: {
                height: { title: "Height", type: "string", default: "150px" },
                width: { title: "Width", type: "string", default: "150px" },
                borderRadius: {
                  title: "Border Radius",
                  type: "string",
                  default: "5px",
                },
                backgroundColor: {
                  title: "Background Color",
                  type: "string",
                  default: "#303030",
                  format: "color",
                },
                display: { title: "Display", type: "string", default: "flex" },
                position: {
                  title: "Position",
                  type: "string",
                  default: "initial",
                },
                flexContainer: { title: "Flex", type: "flexContainer" },
                margin: { title: "Margin", type: "margin" },
                padding: { title: "Padding", type: "padding" },
                flex: { title: "Flex", type: "string", default: "1" },
              },
            },
          },
        },
        defaultPropValue: {
          style: {
            height: "150px",
            width: "150px",
            borderRadius: "5px",
            backgroundColor: "#303030",
            display: "flex",
            position: "initial",
            flex: "1",
          },
        },
        icon: "List",
        _id: "628695e9891321c8b9743598",
      },
      {
        name: "Screen",
        componentType: "Screen",
        schema: {
          type: "layout-component",
          title: "Screen",
          icon: "Crop32",
          componentType: "Screen",
          description: "A plain old text field",
          width: 350,
          height: 667,
          properties: {
            properties: {
              type: "object",
              title: "Properties",
              properties: {
                text: {
                  type: "string",
                  title: "Page Title",
                  description: "The title for the page",
                  default: "Page 1",
                },
              },
            },
            layout: { type: "object", title: "Layout" },
            style: {
              type: "object",
              title: "Styles",
              description: "The style for the component",
              properties: {
                height: { title: "Height", type: "number", default: 667 },
                width: { title: "Width", type: "number", default: 350 },
                padding: { title: "Padding", type: "padding" },
                flexContainer: { title: "Flex", type: "flexContainer" },
                backgroundColor: {
                  title: "Background Color",
                  type: "string",
                  default: "#ffffff",
                  format: "color",
                },
              },
            },
            actions: {
              type: "object",
              title: "Actions",
              properties: {
                onLoad: {
                  type: "function",
                  title: "onLoad",
                  arguments: [],
                  returnType: "null",
                },
              },
            },
          },
        },
        defaultPropValue: {
          properties: { text: "Page 1" },
          style: { height: 667, width: 350, backgroundColor: "#ffffff" },
        },
        icon: "Crop32",
        _id: "628695e9891321c8b9743599",
      },
      {
        name: "Stack",
        componentType: "Stack",
        schema: {
          type: "ui-component",
          title: "Stack",
          icon: "FilterNone",
          componentType: "Stack",
          description: "A plain old text field",
          width: 2000,
          height: 1000,
          properties: {
            style: {
              type: "object",
              title: "Styles",
              description: "The style for the component",
              properties: {
                height: { title: "Height", type: "number", default: 1000 },
                width: { title: "Width", type: "number", default: 2000 },
              },
            },
          },
        },
        defaultPropValue: { style: { height: 1000, width: 2000 } },
        icon: "FilterNone",
        _id: "628695e9891321c8b974359a",
      },
      {
        name: "Text",
        componentType: "Element",
        schema: {
          type: "ui-component",
          title: "Text",
          icon: "FormatColorText",
          description: "A plain old text field",
          componentType: "Element",
          width: 160,
          height: 35,
          properties: {
            properties: {
              type: "object",
              title: "Properties",
              properties: {
                text: {
                  type: "string",
                  title: "Display value",
                  description: "The value to display",
                  default: "Lorem Ipsum",
                },
              },
            },
            style: {
              type: "object",
              title: "Styles",
              description: "The style for the component",
              properties: {
                height: { title: "Height", type: "number", default: 24 },
                width: { title: "Width", type: "number", default: 160 },
                color: {
                  title: "Text Color",
                  type: "string",
                  format: "color",
                  default: "#000000",
                },
                font: { title: "Font", type: "font" },
                display: {
                  title: "Display",
                  type: "string",
                  default: "inline",
                },
                position: {
                  title: "Position",
                  type: "string",
                  default: "initial",
                },
                alignSelf: { title: "Align Self", type: "string" },
                flex: { title: "Flex", type: "number" },
              },
            },
          },
        },
        defaultPropValue: {
          properties: { text: "Lorem Ipsum" },
          style: {
            height: 24,
            width: 160,
            color: "#000000",
            display: "inline",
            position: "initial",
          },
        },
        icon: "FormatColorText",
        _id: "628695e9891321c8b974359b",
      },
      {
        name: "TextInput",
        componentType: "Element",
        schema: {
          type: "ui-component",
          title: "TextInput",
          icon: "Input",
          description: "A plain old text field",
          componentType: "Element",
          width: 160,
          height: 35,
          properties: {
            properties: {
              type: "object",
              title: "Properties",
              properties: {
                text: {
                  type: "string",
                  title: "Text Value",
                  description: "The value of the text",
                  dataBound: true,
                },
                placeholder: {
                  type: "string",
                  title: "Placeholder",
                  description: "Placeholder text for the input",
                  default: "Enter...",
                },
              },
            },
            style: {
              type: "object",
              title: "Component Styling",
              description: "The style for the component",
              properties: {
                height: { title: "Height", type: "number", default: 24 },
                width: { title: "Width", type: "number", default: 160 },
                color: {
                  title: "Text Color",
                  type: "string",
                  format: "color",
                  default: "#000",
                },
                borderColor: {
                  title: "Border Color",
                  type: "string",
                  format: "color",
                  default: "#000",
                },
                borderStyle: {
                  title: "Border Style",
                  type: "string",
                  enum: [
                    "dashed",
                    "dotted",
                    "double",
                    "groove",
                    "hidden",
                    "inset",
                    "none",
                    "outset",
                    "ridge",
                    "solid",
                  ],
                  default: "solid",
                },
                borderWidth: {
                  title: "Border Width",
                  type: "number",
                  default: 1,
                },
                borderRadius: {
                  title: "Border Radius",
                  type: "number",
                  default: 5,
                },
              },
            },
          },
        },
        defaultPropValue: {
          properties: { placeholder: "Enter..." },
          style: {
            height: 24,
            width: 160,
            color: "#000",
            borderColor: "#000",
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 5,
          },
        },
        icon: "Input",
        _id: "628695e9891321c8b974359c",
      },
    ],
    authorId: "6209c823d4c7d4df5e7fdf84",
    scope: "Global",
    __v: 0,
  },
];


export const currentOutput = `import { Screen, Container, Text, TextInput, Button } from '@fuchsia-for-all/primitives'
import React, { useState } from 'react'
import { useLoginMutation } from './generated/graphql'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native'

export function LoginScreen () {
   const [UsernameTextInputtext, setUsernameTextInputtext] = useState<string>()
   const [PasswordTextInputtext, setPasswordTextInputtext] = useState<string>()
   const [login] = useLoginMutation()
   const navigate = useNavigation<any>()
async function Button_onPress() {
const success = await login({ variables: { username: \`\`, password: \`\`}});
if (success.data) {
await AsyncStorage.setItem('authToken', success.data.login);
navigate.navigate('HomeScreen', {
});
}
if (success.errors) {
Alert.alert("Failed to login");
}
}
   return (
      <Screen>
         <Container style={{"height":150,"borderRadius":5,"backgroundColor":"#f8e71c","display":"flex","position":"initial","margin":{"left":10,"right":10,"top":10,"bottom":10},"padding":{"left":0}}} >
            <Text properties={{"text":"Lorem Ipsum"}} style={{"height":24,"width":160,"color":"#7ed321","display":"inline","position":"initial","font":{"size":{"blocks":[{"key":"303gm","text":"18","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[]}]},"style":{"blocks":[{"key":"b8lv3","text":"normal","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[]}]},"weight":"weight","textAlign":"auto","textTransform":"none","lineHeight":"1em"}}} />
            <TextInput text={{ value: UsernameTextInputtext, onChange: setUsernameTextInputtext}} properties={{"placeholder":"Enter...","text":"undefined"}} style={{"height":24,"width":160,"color":"#000","borderColor":"#000","borderStyle":"solid","borderWidth":1,"borderRadius":5}} />
            <Text properties={{"text":"Lorem Ipsum"}} style={{"height":24,"width":160,"color":"#000000","display":"inline","position":"initial"}} />
            <TextInput text={{ value: PasswordTextInputtext, onChange: setPasswordTextInputtext}} properties={{"placeholder":"Enter...","text":"undefined"}} style={{"height":24,"width":160,"color":"#000","borderColor":"#000","borderStyle":"solid","borderWidth":1,"borderRadius":5}} />
            <Button properties={{"title":"Lorem Ipsum"}} style={{"height":35,"width":175,"backgroundColor":"#417505","borderRadius":5,"display":"flex","position":"initial","placement":"initial"}} actions={{"onPress":"Button_onPress"}} >
               <Text properties={{"text":"Lorem Ipsum"}} style={{"height":24,"width":160,"color":"#ffffff","display":"inline","position":"initial"}} />
            </Button>
         </Container>
         <Button properties={{"title":"Lorem Ipsum"}} style={{"height":35,"width":175,"backgroundColor":"#000000","borderRadius":5,"display":"flex","position":"initial","placement":"initial","margin":{"left":50,"right":0,"top":10}}} />
      </Screen>
   )
}`

export const expectedOutput = `import { Screen, Container, Text, TextInput, Button } from '@fuchsia-for-all/primitives'
import React, { useState } from 'react'
import { useLoginMutation } from './generated/graphql'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native'

export function LoginScreen () {
   const [UsernameTextInputtext, setUsernameTextInputtext] = useState<string>('')
   const [PasswordTextInputtext, setPasswordTextInputtext] = useState<string>('')
   const [login] = useLoginMutation()
   const navigate = useNavigation<any>()
async function Button_onPress() {
const success = await login({ variables: { username: UsernameTextInputtext, password: PasswordTextInputtext}});
if (success.data) {
await AsyncStorage.setItem('authToken', success.data.login);
navigate.navigate('HomeScreen', {
});
}
if (success.errors) {
Alert.alert("Failed to login");
}
}
   return (
      <Screen>
         <Container style={{"height":150,"borderRadius":5,"backgroundColor":"#f8e71c","display":"flex","position":"initial","margin":{"left":10,"right":10,"top":10,"bottom":10},"padding":{"left":0}}} >
            <Text properties={{"text":"Lorem Ipsum"}} style={{"height":24,"width":160,"color":"#7ed321","display":"inline","position":"initial","font":18,"style":"normal","weight":"weight","textAlign":"auto","textTransform":"none","lineHeight":"1em"}}} />
            <TextInput text={{ value: UsernameTextInputtext, onChange: setUsernameTextInputtext}} properties={{"placeholder":"Enter..."}} style={{"height":24,"width":160,"color":"#000","borderColor":"#000","borderStyle":"solid","borderWidth":1,"borderRadius":5}} />
            <Text properties={{"text":"Lorem Ipsum"}} style={{"height":24,"width":160,"color":"#000000","display":"inline","position":"initial"}} />
            <TextInput text={{ value: PasswordTextInputtext, onChange: setPasswordTextInputtext}} properties={{"placeholder":"Enter..."}} style={{"height":24,"width":160,"color":"#000","borderColor":"#000","borderStyle":"solid","borderWidth":1,"borderRadius":5}} />
            <Button properties={{"title":"Lorem Ipsum"}} style={{"height":35,"width":175,"backgroundColor":"#417505","borderRadius":5,"display":"flex","position":"initial","placement":"initial"}} actions={{"onPress":Button_onPress}} >
               <Text properties={{"text":"Lorem Ipsum"}} style={{"height":24,"width":160,"color":"#ffffff","display":"inline","position":"initial"}} />
            </Button>
         </Container>
         <Button properties={{"title":"Lorem Ipsum"}} style={{"height":35,"width":175,"backgroundColor":"#000000","borderRadius":5,"display":"flex","position":"initial","placement":"initial","margin":{"left":50,"right":0,"top":10}}} />
      </Screen>
   )
}`