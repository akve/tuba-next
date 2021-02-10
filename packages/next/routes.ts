const routes = [
    {
        path: '/products',
        name: 'Товары',
        layout: '/admin',
        icon: 'ni ni-vector text-primary',
    },
      {
        path: '/settings/admins',
        name: 'Администраторы',
        layout: '/admin',
        icon: 'ni ni-support-16 text-primary',
      },
      /*{
        path: '/404',
        name: 'Automation',
        layout: '/admin',
        icon: 'ni ni-vector text-primary',
      },*/
      {
        path: '/colors',
        name: 'Цвета',
        layout: '/admin',
        icon: 'ni ni-sound-wave text-primary',
      },
      {
        path: '/collections',
        name: 'Коллекции',
        layout: '/admin',
        icon: 'ni ni-world text-primary',
      },
      {
        path: '/categories',
        name: 'Категории',
        layout: '/admin',
        icon: 'ni ni-archive-2 text-primary',
      },
];

export default routes;
