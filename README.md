# MiniPCP HS
Former MiniPCP Desktop Server

## Overview
MiniPCP HS (for Hybrid Server), formerly MiniPCP Desktop Server, is a transition solution to enable MiniPCP migration to WebMRP web application. Initially, it was intended to be just a web client for MiniPCP reports. After it was migrated from Free Pascal to Node.js, it rapidly evolved to a full application server, including JWT authentication and static content serving.

Currently, the server acts as a BFF, and as an application server. But it can be easily split in multiple services in the future.

Although it is a monolith, each feature lives in its own repository, so features can be developed independently from each other.

## Development
* Inside your projects folder, clone this repository: `git clone https://github.com/efxtecnologia/minipcp-hs.git`
* CD into features folder: `cd ./minipcp-hs/app/features`
* Get the base features repository: `git clone  https://github.com/efxtecnologia/minipcp-hs-base-features.git`
* Rename `features.template.js` to `features.js`: `mv features.template.js features.js`
* Install other features you have access to
* Get back to the main app folder: `cd ..`
* Install yarn modules: `yarn install`
* Run the server: `node server.js`

## Reports
The reports server depends a lot on frontend parsing, because of the original conception of the server. It takes MiniPCP reports definitions and adapts them to return json objects. New report sources may be added, including static sources that could be added to this server. The logic that converts MiniPCP reports definitions into JS obects is all inside `app/logic/reports.js` file.

Report data is served as standalone CSV on demand. The client must parse the definition, show the report dialog and request data to the server, passing dialog arguments informed by the user.

### Report definition format
TBD

### Writing a static report
TBD

## Features
Feature is a functionality rendered by the server. All presentation and business logic run on the server. A client should parse and render the feature, and then assign actions to controls.

### Feature anatomy
A feature is an object that contains identification properties, a main controller and, optionally, a list of actions. An `Action` is an object that contains an `action` property and, optionally, a `controller` property that will be used as the feature main controller.

#### Feature object
```javascript
    const actions = [actionA, actionB, actionC ...];

    {
        group: "Group name",
        id: "feature-unique-id",
        title: "Feature description",
        group_order: 1,
        requiredScopes: [config.scopes.authTrusted],
        controller,
        actions,
    }
```
* group - this is the name of the group to be shown in the features index tree.
* id - a unique id that will be used by the client when requesting the feature.
* title - the title to be displayed on the menu.
* group_order - the order of the feature inside the group index.
* requiredScopes - a list of scopes allowed to access this feature
* controller - the main feature handler (more details on "Writing a new feature" session).
* actions - a list of action objects (see detail below).

#### Action object
```javascript
    {
        id: "action-unique-id",
        method: GET, // GET | POST | PUT | DELETE
        handler, // a function that receives (context, req, callback)
    }
```

## HTML Templating
Since I was introduced to the [hiccup](https://github.com/weavejester/hiccup/wiki) library, it makes much more sense to me to declare html as data structures rather than the traditional html templating engines, such as [Handlebars ](https://handlebarsjs.com/) or [Mustache](https://mustache.github.io/). Since the markup is declared as data, it's not necessary to make string interpolations or use some specific template language. The only language you need is JS. Although this project doesn't implement a hiccup library, its [frontend counterpart](https://github.com/hbolzan/js-reports-generator) does.

The "hiccup like" syntax is
```javascript
["tag", attributes, "content", [child, child-2, ...]]
```
Attributes, content and children are all optional, so any list where the first element is a valid html tag, is a valid hiccup structure.

Attributes is an object containing keys values that will be rendered as html attributes
```javascript
["div", { id: "unique-element-id"}]
```

If an attribute value is an array, its elements will be rendered as string of values separeted by spaces. This is useful to declare multiple classes in an html element.
```javascript
["p" { class: ["class-a", "class-b", "class-c"]} "Paragraph content"]

<p class="class-a class-b class-c">Paragraph content</p>
```

When the attribute value is an object, it will be rendered as key/value pairs separated by semicolons. This is useful to declare style attributes.
```javascript
["div" { style: { color: "blue", maxHeight: "300px" }} "Some content"]

<div style="color: blue; max-height: 300px">Some content</p>
```
Note that camel case key names will be automatically converted to kebab case.


Here are some more examples
```javascript
["div", "This is a div"] 
<div>This is a div</div>

["div", { class: ["some-class", "other-class"] }, "This is a div"] 
<div class="some-class other-class">This is a div</div>
```

With nested children
```javascript
["div", { class: ["list-class"] },
 ["ul",
  ["li", "First item"],
  ["li", "Second item"],
  ["li", "Third item"]]] 
```
         
```html
<div class="list-class">
  <ul>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
  </ul>
</div>
```

Since it's just data, it can be built by a function
```javascript
function todoList(items) {
    return ["ul", { id: "my-own-id" }].concat(items.map(i => ["li", i])]);
}
```

The todoList function will return a hiccup data structure
```javascript
todoList(["First", "Second", "Third"])
=> ["ul", ["li", "First"], ["li", "Second"], ["li", "Third"]]
```

That will be rendered by the frontend parser to this
```html
<ul id="my-own-id">
    <li id="c2756d01-28f4-4e7d-81a8-6c32b5333547">First</li>
    <li id="a248dc42-1604-482d-b76e-cbf3e19a6669">Second</li>
    <li id="74b2c1ea-dab7-48ca-a4fd-d7547f10d0a8">Third</li>
</ul>
```

This approach allows writing views that are easily composable and extensible, and way easier to reason about.

### Writing a new feature
This is a real life example. It implements the user change password feature.

#### Creating an empty feature

* Create a new folder for the feature below `app/features` folder.
* Inside the feature folder, create an `index.js` file.
* Write the feature constructor boilerplate.
```javascript
function ChangePassword(components) {
    return {
        group: "User",
        id: "change-passowrd",
        title: "Change password",
        group_order: 1,
        allowedScopes: [ "dev", "superadm" ],
        controller: (context, req, callback) => callback({}),
        actions: [],
    };
}

module.exports = ChangePassword;
```
* Open `app/features/index.js` file
* Require the new feature
```javascript
const ChangePassword = require("./change-password/index.js");

```
* Declare an instance of the new feature in the beginning of the `FeaturesIndex` constructor and append it to the existing features list.
```javascript
function FeaturesIndex(components) {
    ...
    const changePassword = ChangePassword(components);

    const features = [
        featureA,
        featureB,
        ...
        changePassword,
    ];

}
```

At this point, the feature is published to the features index, and can be requested with a `GET` request to `/api/v1/features/change-password` endpoint. If you reload the frontend, the new feature is already listed on the features menu.

#### Adding a view

A feature must have at least one view to allow interaction. A feature may contain one or more views.
* Add a folder called `views` to the feature folder.
* Create a file called `main.js` inside the views folder.
* Write the `MainView` constructor. A view must implement the render method.
* The empty actions list declared in the example below, will be used later, to add functionalities to the view.
```javascript
function MainView(components) {

    const actions = [];

    function hiccup() {
        return ["h2", "Change user password"];
    }

    function render() {
        return {
            actions,
            hiccup: hiccup(),
        };
    }

    return {
        render,
    };
}

module.exports = MainView;
```
* Edit the feature index file `features/change-password/index.js`.
  * Require and instantiate the main view.
  * Write a controller that calls the callback passing the view object as argument.
After the changes it should look like this:
```javascript
const MainView = require("./views/main.js");

function ChangePassword(components) {
    const mainView = MainView(components);

    function controller(context, req, callback) {
        callback({
            name: "changePassword",
            description: "Change user password",
            views: [mainView.render()]
        });
    }

    return {
        group: "User",
        id: "change-password",
        title: "Change password",
        group_order: 1,
        controller,
        actions: [],
    };
}

module.exports = ChangePassword;
```
Note that the views property returned by the controller, is expected to contain a list of **rendered** views. Don't forget to call the `render` method for each view added to the list.

At this point, the frontend will render an h2 header with the text "Change user password" when the feature is selected in the features menu.

#### Actions - adding functionality to the feature
First, rewrite the main view `hiccup` function to render a change password form. Declare unique id's for each element in the form. You will need them later to bind actions to the form elements. Also, add an `ids` property, with all element id's, to the returned object, to expose them. We will need those id's later when adding functionality.
```javascript
function MainView(components) {
    const id = "change-password.main",
          formId =  `${ id }.change-password-form`,
          currentPasswordId = `${ id }.current-password`,
          newPasswordId = `${ id }.new-password`,
          newPasswordConfirmationId = `${ id }.new-password-confirmation`,
          newPasswordPostId = `${ id }.new-password-post`;

    const actions = [];

    function hiccup() {
        return card({
            title: "Alteração de senha",
            subtitle: "Caso não saiba a sua senha atual, solicite ao usuário administrador que faça a alteração ou entre em contato com o suporte técnico",
            body: ["form", { id: formId, class: ["uk-form-stacked"] },
                   ["div", { class: ["uk-margin"] },
                    ["label", { class: ["uk-text-bold", "uk-form-label"], for: currentPasswordId }, "Senha atual"],
                    ["div", { class: ["uk-form-controls"] },
                     ["input", { id: currentPasswordId, type: "password", class: ["uk-input"]}]]],
                   ["div", { class: ["uk-margin"] },
                    ["label", { class: ["uk-text-bold", "uk-form-label"], for: newPasswordId }, "Nova senha"],
                    ["div", { class: ["uk-form-controls"] },
                     ["input", { id: newPasswordId , type: "password", class: ["uk-input"]}]]],
                   ["div", { class: ["uk-margin"] },
                    ["label", { class: ["uk-text-bold", "uk-form-label"], for: newPasswordConfirmationId }, "Confirmação da nova senha (digite novamente)"],
                    ["div", { class: ["uk-form-controls"] },
                     ["input", { id: newPasswordConfirmationId, type: "password", class: ["uk-input"]}]]]],
            footer: ["div", { class: ["uk-margin", "uk-align-right"]},
                     ["button",
                      { id: newPasswordPostId, class: ["uk-button", "uk-button-primary", "uk-margin-small-right"] },
                      "Alterar Senha"]],
        });
    }

    ...

    return {
        ids: {
            id,
            formId,
            currentPasswordId,
            newPasswordId,
            newPasswordConfirmationId,
            newPasswordPostId,
        },
        render,
    };

}
```
This will render the change password form on the frontend.
![image](https://user-images.githubusercontent.com/26502433/166680219-5168e120-028a-4a02-a21f-fa15fcd47c27.png)

Now it's time to add actual functionality. The first step is to create an action. An action is a handler for an http request to the actions endpoint. Once the action is published, it may be requested by its unique id passed as a path param to the enpoint.
* Add a new folder called `actions` below `features/change-password`.
* Inside that folder, create a file called `change-password.js`.
* Write the action constructor.
```javascript
const { fetchMethods } = require("../../common/resources.js"),
      { GET, POST } = fetchMethods;

function ChangePasswordAction(components, view) {
    function handler(context,  req,  callback) {
        callback({});
    }

    return {
        id: "change-password",
        method: POST,
        handler,
    };
}

module.exports = ChangePasswordAction;

```
Note that, although the action id must be unique, the same id may be shared between actions for diferent http methods (GET, POST, PUT, DELETE).

To publish the action, add it to the actions list in the feature index.
* Open the `features/change-password/index.js` and change it to look like this:
```javascript
const MainView = require("./views/main.js"),
      ChangePasswordAction = require("./actions/change-password.js");

function ChangePassword(components) {
    const mainView = MainView(components),
          changePasswordAction = ChangePasswordAction(components, mainView);

    function controller(context, req, callback) {
        callback({
            name: "changePassword",
            description: "Alteração de senha de usuário",
            views: [mainView.render()]
        });
    }

    return {
        group: "Usuário",
        id: "change-password",
        title: "Alteração de senha",
        group_order: 1,
        controller,
        actions: [changePasswordAction],
    };
}

module.exports = ChangePassword;
```
Note that we are passing the view as an argument to the action. This is useful case the action needs some context from the view, or needs to send data to the view.

Now it's time to bind the action to the view. Note that view actions are not the same as the feature actions declared in the feature object. They are instructions binded to view elements, or to the view itself, that can instruct the view to call feature actions.

In the `views/main.js` file, actions will be added to the `actions` array declared on the beginning of the view constructor.
* Right after the constants with all the id's, declare a new constant called `actions`. The actions inside the view are instructions binded to view elements, or to the view itself. They do not necessarily have to call the actions published on the api actions endpoint. An action looks like the following:
```javascript
{
    type: "alert", // this actions pops up a modal alert triggered  by the event on the element
    elementId: "some-element-id",
    event: "onclick",
    args: { message: "Yes, it works!!!" }, // args contains the message that will show up in the alert box
}
```
The example above works indeed. If you replace `"some-element-id"` by the button id `newPasswordPostId`, an add it to the actions list, it will popup an alert when you click the button. But we want more than that, right?

To change the password, we need to perform some steps (from the web client point of view)
1. Gather all data from the form fields and put it into an object.
2. Post gathered data to the change password action and store the response into another object.
3. Popup a modal alert to inform if the action was succesful or not.
4. Clear the form.

The client steps are defined in an action declared inside the view.
```javascript
{
    elementId: newPasswordPostId,  // the confirmation button
    type: "perform",               // the perform action type, peforms a sequence of steps
    event: "onclick",              // the action will be triggered by the element onclick event
    args: {
        steps: [
            // step 1: gather data and put it into an object called changePasswordData
            { type: "gatherChildren", gather: { from: formId, into: "changePasswordData" } },

            // step 2: POST gathered data (withBody property) and put response into changePasswordStatus
            { type: "fetch", method: POST, from: "change-password", into: "changePasswordStatus", withBody: ["changePasswordData"] },

            // step 3: popup and alert with response
            { type: "alert", message: { from: "changePasswordStatus.statusMessage" }},

            // step 4: fill the inputs with values returned by the server
            //         since there isn't any logic in the client, the server decides
            //         if the inputs are cleared or will keep their values
            {
                type: "setInputValues",
                setInputValues: {
                    contentKeys: [
                        "changePasswordStatus.currentPassword",
                        "changePasswordStatus.newPassword",
                        "changePasswordStatus.newPasswordConfirmation",
                    ],
                    inputIds: [
                        currentPasswordId,
                        newPasswordId,
                        newPasswordConfirmationId,
                    ]
                }
            },
        ]
    }
}
```

The server, in turn, must
1. Check if new password and password confirmation values match.
2. Check if the new password is not empty
3. Make sure the new password is at least 3 characters long.
4. Check if current password is valid.
5. Update the password in users database **OR** raise an exception if something is wrong.
6. Return the response to the client.
The server steps are performed by the feature action that will be called by the client in the second step.

Before we go back to the action handler, we need to write the logic that validates the new password. Write all pure logic in a separate namespace.
* Create a new folder called `logic` under `features/change-password/` folder.
* Create a file called `password.js` inside `features/change-password/logic/` folder.
* Add the following code.
```javascript
const passwordErrors = {
    fieldsDontMatch: "password and confirmation fields don't match",
    isEmpty: "password is empty",
    notLongEnough: "password must be at least 3 characters long",
    invalidCurrentPassword: "current password is not valid",
};

const successfulChange = "Password successfully changed";

function inputById(ids, inputs, id) {
    return inputs.filter(i => i.id === ids[id])[0] || {};
}

function passwordFieldsMatch(newPassword, newPasswordConfirmation) {
    return newPassword === newPasswordConfirmation;
}

function isEmpty(x) {
    return x === "";
}

function isLongEnough(newPassword) {
    return newPassword.length >= 3;
}

function validPassword({ ids }, inputs) {
    const currentPassword = inputById(ids, inputs, "currentPasswordId").value ?? "",
          newPassword = inputById(ids, inputs, "newPasswordId").value ?? "",
          newPasswordConfirmation = inputById(ids, inputs, "newPasswordConfirmationId").value ?? "",
          passwords = { currentPassword, newPassword, newPasswordConfirmation };

    if ( ! passwordFieldsMatch(newPassword, newPasswordConfirmation) ) {
        return { ...passwords, error: passwordErrors.fieldsDontMatch };
    }

    if (  isEmpty(newPassword) ) {
        return { ...passwords, error: passwordErrors.isEmpty };
    }

    if ( ! isLongEnough(newPassword) ) {
        return { ...passwords, error: passwordErrors.notLongEnough };
    }

    return passwords;
}

const cleanPasswords = { currentPassword: "", newPassword: "", newPasswordConfirmation: "" };
function response(validated, inputs) {
    if ( validated.error ) {
        return { ...validated, statusMessage: validated.error };
    }
    return { ...cleanPasswords,  statusMessage: successfulChange };
}

module.exports = {
    passwordErrors,
    validPassword,
    response,
};
```

Back to `actions/change-password.js`, we will implement the server steps into `ChangePasswordAction` action.

The action handler receives a request object that contains the payload sent by the client. So we can get the form data from the request body.

```javascript
const { validPassword, passwordErrors, response } = require("../logic/password.js"),
      { fetchMethods } = require("../../common/resources.js"),
      { POST } = fetchMethods;

function ChangePasswordAction(components, view) {
    const { auth } = components;

    async function validCurrentPassword(userName, preValidated) {
        if ( preValidated.error ) {
            return preValidated;
        }
        if ( ! await auth.validUser(userName, preValidated.currentPassword) ) {
            return { ...preValidated, error: passwordErrors.invalidCurrentPassword };
        }
        return preValidated;
    }

    async function setPassword(userName, validated) {
        if ( ! validated.error ) {
            await auth.setPassword(userName, validated.newPassword);
        }
    }

    async function handler(context,  req,  callback) {
        const inputs = req.body.changePasswordData || [],
              userName = req.auth.username,
              validated = await validCurrentPassword(req.auth.username, validPassword(view, inputs));
        await setPassword(userName, validated);
        callback(response(validated, inputs));
    }

    return {
        id: "change-password",
        method: POST,
        handler,
    };
}

module.exports = ChangePasswordAction;
```
