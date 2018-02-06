export const mapArticles = payload =>
  payload.map(item => {
    const uiProperties = {
      id: item.name,
      links: {
        open: `/articles/${item.name}`
      }
    }

    return {
      ...uiProperties,
      ...item
    }
  })
