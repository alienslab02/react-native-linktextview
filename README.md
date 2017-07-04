# react-native-linktextview

An android-only react-native component to add clickable urls inside a regular Text with support of accessibilty.

# Installation
`npm install git://github.com/alienslab02/react-native-linktextview.git`

# Usage

Import it in a class like:
`import LinkText from 'react-native-linktextview';`

Use it like;

```
<LinkText style={styles.description}>
  <LinkText text={'Do you want to search it on google? '} />
  <LinkText
    style={styles.link}
    url={'https://google.com'}
    text={'Click Here'}
  />
</LinkText>
```

`LinkText` supprts all properties of React-Native `Text` component.

