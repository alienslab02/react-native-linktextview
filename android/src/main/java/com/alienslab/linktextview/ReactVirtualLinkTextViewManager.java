/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 * <p>
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.alienslab.linktextview;

import com.facebook.react.common.annotations.VisibleForTesting;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = ReactVirtualLinkTextViewManager.REACT_CLASS)
public class ReactVirtualLinkTextViewManager extends ReactRawTextManager {

    @VisibleForTesting
    public static final String REACT_CLASS = "ReactVirtualLinkTextView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public ReactTextShadowNode createShadowNodeInstance() {
        return new ReactVirtualLinkTextShadowNode();
    }
}
