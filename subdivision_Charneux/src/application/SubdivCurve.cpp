#include "SubdivCurve.h"
#include <cmath>
#include <iostream>

#include "Vector3.h"
#include "Matrix4.h"

using namespace std;
using namespace p3d;

SubdivCurve::~SubdivCurve() {
}

SubdivCurve::SubdivCurve() {
    _nbIteration=1;
    _source.clear();
    _result.clear();

}


void SubdivCurve::addPoint(const p3d::Vector3 &p) {
    _source.push_back(p);
}

void SubdivCurve::point(int i,const p3d::Vector3 &p) {
    _source[i]=p;
}


void SubdivCurve::chaikinIter(const vector<Vector3> &p) {
    _result.clear();
    if(isClosed())
        _result.resize(2*p.size());
    else
        _result.resize(2*p.size()-2);
    int i;
    for(i = 0; i < p.size()-1; i++){
        _result[2*i] = (3*p[i]/4) + (p[i+1]/4);
        _result[2*i+1] = (p[i]/4) + (3*p[i+1]/4);
    }

    if(isClosed()){
        _result[2*i] = (3*p[i]/4) + (p[0]/4);
        _result[2*i+1] = (p[i]/4) + (3*p[0]/4);
    }
}

void SubdivCurve::dynLevinIter(const vector<Vector3> &p) {
    _result.clear();
    _result.resize(2*p.size());

    for(int i = 0; i < p.size(); i++){
        _result[2*i] = p[i];
        //attention au i-1 qu'il faut aussi moduler
        _result[2*i+1] = (-( p[(i+2)%p.size()] + p[(p.size()+i-1)%p.size()] )/16)
                + (9*(p[(i+1)%(p.size())] + p[i])/16);
    }
}


void SubdivCurve::chaikin() {
    if (_source.size()<2) return;
    vector<Vector3> current;
    _result=_source;
    for(int i=0;i<_nbIteration;++i) {
        current=_result;
        chaikinIter(current);
    }
}

void SubdivCurve::dynLevin() {
    if (_source.size()<2) return;
    if (!isClosed()) return;
    vector<Vector3> current;
    _result=_source;
    for(int i=0;i<_nbIteration;++i) {
        current=_result;
        dynLevinIter(current);
    }
}


