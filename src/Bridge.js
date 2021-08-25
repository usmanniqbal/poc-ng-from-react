import { Fragment, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import angular from "angular";
import "@uirouter/angularjs";

angular
  .module("nonono", ["ui.router"])
  .config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    const helloState = {
      name: "hello",
      url: "/hello",
      template: `<h3>hello world from ui router!</h3>
        <img src="/logo192.png">
      `,
    };

    const aboutState = {
      name: "about",
      url: "/about",
      template: "<h3>another route using ui-router</h3>",
    };

    $stateProvider.state(helloState);
    $stateProvider.state(aboutState);
  })
  .controller("TodoCtrl", [
    "$scope",
    function TodoCtrl($scope) {
      $scope.todos = [
        { text: "learn angular", done: true },
        { text: "build an angular app", done: false },
      ];

      $scope.addTodo = function () {
        $scope.todos.push({ text: $scope.todoText, done: false });
        $scope.todoText = "";
      };

      $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.todos, function (todo) {
          count += todo.done ? 0 : 1;
        });
        return count;
      };

      $scope.archive = function () {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function (todo) {
          if (!todo.done) $scope.todos.push(todo);
        });
      };
    },
  ]);

const template = `
<div class="ng-base">
<h2>Todo</h2>
  <div ng-controller="TodoCtrl">
    <span>{{remaining()}} of {{todos.length}} remaining</span>
    [ <a href="" ng-click="archive()">archive</a> ]
    <ul class="unstyled">
      <li ng-repeat="todo in todos">
        <input type="checkbox" ng-model="todo.done">
        <span class="done-{{todo.done}}">{{todo.text}}</span>
      </li>
    </ul>
    <form ng-submit="addTodo()">
      <input type="text" ng-model="todoText"  size="30"
             placeholder="add new todo here">
      <input class="btn-primary" type="submit" value="add">
    </form>
    
    <a ui-sref="hello" ui-sref-active="active">Hello</a>
    <a ui-sref="about" ui-sref-active="active">About</a>

    <ui-view></ui-view>
  </div>
</div>
`;

const useLegacyApp = (ref) => {
  if (ref === null || typeof ref === "undefined") {
    throw new Error(
      "useLegacyApp hook requires a reference to an element for mounting legacy app"
    );
  }

  const scope = useRef();

  const init = (name) => {
    const ng = window.angular;
    // get the injector instance to either inject a new provider or a get the instance
    // of any angular service –– we could potentially use this to get rid of loader controller
    // and make all the angular services to fetch their data from this component if need be.
    const injector = ng.injector([
      "ng",
      name,
      // setting up the root element manually before angular bootstrapping process gets started
      [
        "$provide",
        function ($provide) {
          $provide.value("$rootElement", angular.element(ref.current));
        },
      ],
    ]);

    scope.current = injector.get("$rootScope");

    if (typeof scope.current !== "undefined") {
      ng.bootstrap(ref.current, [name]);
    }
  };

  useEffect(() => {
    function effect() {
      init("nonono");
    }

    effect();

    return () => {
      if (
        typeof scope.current !== "undefined" &&
        typeof scope.current.$destroy === "function"
      ) {
        // kill the app's instance on unmount just in case.
        scope.current.$destroy();
      }
    };
  }, []);
};

const Bridge = () => {
  const root = useRef();
  useLegacyApp(root);

  return (
    <Fragment>
      <Helmet defer={false}>
        <base href="/bridge/" />
      </Helmet>
      <div ref={root}>
        <div
          dangerouslySetInnerHTML={{
            __html: template,
          }}
        />
      </div>
    </Fragment>
  );
};

export default Bridge;
