#echo "" > ./modules/css-generated.ts
sass ./assets/scss/nextjs-argon-dashboard-pro.scss ./public/assets/out.css
sass ./assets/scss/public.scss ./public/assets/public.css
#cat ./modules/css.pre ./assets/css/out.css ./modules/css.post >> ./modules/css-generated.ts
