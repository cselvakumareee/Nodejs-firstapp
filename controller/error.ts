export const pageNotFoundController = (req: any, res: any, next: any) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: req.path,
    active404: true
});
}