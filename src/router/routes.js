const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/feedback", component: () => import("pages/PageFeedBack.vue") },
      { path: "/", component: () => import("pages/Index.vue") },
      { path: "/Students", component: () => import("pages/PageStudents.vue") },
      {
        path: "/asignments",
        component: () => import("pages/PageAsignments.vue")
      },
      {
        path: "/classes",
        component: () => import("pages/PageClasses.vue"),
        props: true,
        children: [
          {
            path: "/classes/:id",
            name: "SingleClass",
            component: () => import("pages/SingleClass.vue"),
            props: true
          }
        ]
      },

      {
        path: "/student/:id",
        name: "SingleStudent",
        component: () => import("pages/PageStudent.vue"),
        props: true
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
