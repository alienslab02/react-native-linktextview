package com.alienslab.linktextview;

import com.facebook.react.uimanager.ThemedReactContext;

/**
 * Created by Bilal Shabbir on 30/06/2017.
 */

public class ReactLinkTextViewManager extends ReactTextViewManager {

    private final String NAME = "ReactLinkTextView";

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public ReactTextView createViewInstance(ThemedReactContext context) {
        return new ReactLinkTextView(context);
    }

}
