const userRoutes = [
  {
    collapse: true,
    name: 'User Administration',
    icon: 'ni ni-single-02 text-yellow',
    state: 'userAdministrationCollapse',
    views: [
      {
        path: '/users',
        name: 'Users',
        layout: '/user',
        icon: 'ni ni-user-run text-yellow',
      },
    ],
  },
];

export default userRoutes;
